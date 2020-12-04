import { action, makeObservable, observable, reaction, toJS } from "mobx";
import { FetchStore } from "..";
import { Primitive } from "../utils.types";
import { lensWrapper } from "../utils/lensWrapper";

type CommitOptions<T> = {
  path?: keyof T;
  findBy?: keyof T[keyof T];
}

type AsyncCommitOptions<T = any, S = any, K = any> = {
  promise: Promise<T>;
  commit: CommitOptions<S>;
  fetch?: FetchStore;
  mapper?: (dto: T) => K;
  onFinish?: (result: T, mapped?: K) => void;
}

export default class LeafStore<StoreState extends object> {
  state: StoreState;

  constructor(state: StoreState, readonly label: string = 'Unlabeled Store') {
    this.state = {} as StoreState; // IDK, need this?
    this.commit(state);

    makeObservable(this, {
      commit: action,
      updateField: action,
      state: observable,
    });
  }

  lens() { // TODO: add there 'first-key', cause we dont want write .for('field') if '.for'-selector called only once 
    return lensWrapper<StoreState>(this.state);
  }

  asyncCommit<T = any, K = T>(options: AsyncCommitOptions<T, StoreState, K>): Promise<T | void> {
    if (options.fetch) {
      options.fetch.setLoading();
    }

    return options.promise.then(
      (value) => {
        if (options.mapper !== undefined) {
          this.commit(options.mapper(value), options.commit);
        } else {
          this.commit(value, options.commit);
        }

        if (options.onFinish) {
          if (options.mapper !== undefined) {
            options.onFinish(value, options.mapper(value));
          } else {
            options.onFinish(value);
          }
        }

        return value;
      }
    ).catch(
      (error) => {
        if (options.fetch) {
          options.fetch.setFailed(error);
        }

        // eslint-disable-next-line no-console
        console.error(error); // TODO: make feature-flag named 'asyncCommitFailedVerbosity'
      }
    ).finally(
      () => {
        if (options.fetch) {
          options.fetch.setDone();
        }
      }
    );
  }

  commit(partialState: Partial<StoreState>, options: CommitOptions<StoreState> = {}): void { // TODO: add 'force' or 'append' option for arrays (forst for overwrite, second means default overwrite and options prevent default behavior)
    if (!this.state) {
      this.state = {} as StoreState;
    }

    if (options.path && partialState instanceof Object && this.state[options.path] instanceof Object) {
      this.updateField(partialState as StoreState[keyof StoreState], options.path);
      return;
    }

    for (const fieldKey in partialState) {
      this.updateField(partialState[fieldKey]!, fieldKey);
    }
  }

  updateField<K extends keyof StoreState>(value: StoreState[K], key: K): void {
    let setted = false;

    if (value instanceof Array && !setted) {
      if (!this.state[key]) {
        this.state[key] = [] as unknown as StoreState[K]; // Why `as unknown`? 
      }

      if (this.state[key] instanceof Array) {
        if (value.length) {
          (this.state[key] as unknown as Array<any>).push(...value);
        } else {
          (this.state[key] as unknown as Array<any>) = value;
        }
      }

      setted = true;
    }

    if (value instanceof Object && !setted) {
      if (!this.state[key]) {
        this.state[key] = {} as StoreState[K];
      }

      for (const field in value) {
        if (Object.prototype.hasOwnProperty.call(value, field)) {
          const element = value[field];
          this.state[key][field] = element;
        }
      }

      setted = true;
    }

    if (!setted) {
      this.state[key] = value;
    }
  }
}
