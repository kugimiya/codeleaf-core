import { action, makeObservable, observable, reaction, toJS } from "mobx";
import { Primitive } from "../types";
import { lensWrapper } from "../utils/lensWrapper";

type CommitOptions<T> = {
  path?: keyof T;
  findBy?: keyof T[keyof T];
}

export default class LeafStore<StoreState extends Record<string, Primitive | Array<Primitive>>> {
  state: StoreState;

  constructor(state: StoreState) {
    this.state = {} as StoreState; // IDK, need this?
    this.commit(state);

    makeObservable(this, {
      commit: action,
      updateField: action,
      state: observable,
    });
  }

  lens() {
    return lensWrapper<StoreState>(this.state);
  }

  commit(partialState: Partial<StoreState>, options: CommitOptions<StoreState> = {}): void {
    if (!this.state) {
      this.state = {} as StoreState;
    }

    if (options.path && partialState instanceof Object && this.state[options.path] instanceof Object) {
      this.updateField(partialState as StoreState[keyof StoreState], options.path);
    }

    for (const fieldKey in partialState) {
      this.updateField(partialState[fieldKey]!, fieldKey);
    }
  }

  updateField<K extends keyof StoreState>(value: StoreState[K], key: K) {
    let setted = false;

    if (value instanceof Array) {
      if (!this.state[key]) {
        this.state[key] = [] as StoreState[K];
      }

      (this.state[key] as any[]).push(...value);

      setted = true;
    }

    if (value instanceof Object) {
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
