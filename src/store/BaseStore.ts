import { action, observable, toJS } from 'mobx';
import { AxiosError } from 'axios';
import FetchStore from './FetchStore';

export type CommitOptions = {
  specificPath: string;
};

export type AsyncCommitOptions<K, L> = {
  promise: Promise<K>;
  mapper: (dto: K) => L;
  commitOptions?: CommitOptions;
  onFinish?: () => void;
  fetch?: FetchStore<K>;
};

const debugAnyCommit = true;

export default class BaseStore<T extends object> {
  label = 'Unlabeled Store';

  @observable
  state: T;

  constructor(state: T, label?: string) {
    this.state = state;

    if (label) {
      this.label = label;
    }
  }

  @action.bound
  commit(state: Partial<T>, options?: CommitOptions): void {
    if (debugAnyCommit) {
      /* eslint-disable */
      console.group(this.label);
      console.log('current state: ', toJS(this.state));
      console.log('data for commit: ', toJS(state));
      console.log('next state: ', toJS({ ...this.state, ...state }));
      console.groupEnd();
      /* eslint-enable */
    }

    this.state = { ...this.state, ...state };
  }

  @action.bound
  asyncCommit<K>(params: AsyncCommitOptions<K, Partial<T>>): void {
    if (params.fetch) {
      params.fetch.setLoading();
    }

    params.promise
      .then((value) => {
        this.commit(params.mapper(value), params.commitOptions);

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
