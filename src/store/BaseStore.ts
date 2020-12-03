import { action, observable, toJS } from 'mobx';
import { AxiosError } from 'axios';
import FetchStore from './FetchStore';

export type CommitOptions = {
  specificPath: string;
};

export type AsyncCommitOptions<K, L> = {
  promise: Promise<K>;
  mapper?: (dto: K) => L;
  commitOptions?: CommitOptions;
  onFinish?: () => void;
  fetch?: FetchStore<K>;
};

const debugAnyCommit = true;

export default abstract class BaseStore<T = any> {
  label = 'Unlabeled Store';

  @observable
  state: T;

  constructor(state: T, label?: string) {
    console.warn('DEPRECATION: please, use LeafStore instead of BaseStore');
    this.state = state;

    if (label) {
      this.label = label;
    }
  }

  @action.bound
  commit(state: Partial<T>, options?: CommitOptions): void {
    let nextState: Partial<T> = {};

    if (options?.specificPath) {
      const pathSiblings = options.specificPath.split('.');
      nextState = pathSiblings.reverse().reduce<Partial<T>>((acc, cur) => ({ [cur]: acc } as Partial<T>), state);
    } else {
      nextState = state;
    }

    if (debugAnyCommit) {
      /* eslint-disable */
      console.group(this.label);
      console.log('current state: ', toJS(this.state));
      console.log('data for commit: ', toJS(state));
      if (options?.specificPath) {
        console.log(`will be written to: { ${options.specificPath} }`);
      }
      console.log('next state: ', toJS({ ...this.state, ...nextState }));
      console.groupEnd();
      /* eslint-enable */
    }

    this.state = { ...this.state, ...nextState };
  }

  @action.bound
  asyncCommit<K>(params: AsyncCommitOptions<K, Partial<T>>): void {
    if (params.fetch) {
      params.fetch.setLoading();
    }

    params.promise
      .then((value) => {
        if (params.mapper !== undefined) {
          this.commit(params.mapper(value), params.commitOptions);
        } else {
          this.commit(value, params.commitOptions);
        }

        if (params.onFinish) {
          params.onFinish();
        }
      })
      .catch((error) => {
        if (params.fetch) {
          params.fetch.setFailed(error as AxiosError<K>);
        }

        // eslint-disable-next-line no-console
        console.error(error);
      })
      .finally(() => {
        if (params.fetch) {
          params.fetch.setDone();
        }
      });
  }

  debugState(): void {
    // eslint-disable-next-line no-console
    console.log(toJS(this.state));
  }
}
