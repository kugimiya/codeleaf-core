import { action, computed } from 'mobx';
import { AxiosError } from 'axios';
import BaseStore from './BaseStore';

export type FetchState<T> = {
  isLoading: boolean;
  isInitialized: boolean;
  error: AxiosError<T> | null;
};

export default class FetchStore<ResponseDto> extends BaseStore<FetchState<ResponseDto>> {
  constructor(label?: string) {
    super({ isLoading: false, isInitialized: false, error: null }, label);
  }

  @computed
  get isLoading(): boolean {
    return this.state.isLoading;
  }

  @computed
  get isInitialized(): boolean {
    return this.state.isInitialized;
  }

  @computed
  get error(): AxiosError<ResponseDto> | null {
    return this.state.error;
  }

  @computed
  get loaded(): boolean {
    return !this.isLoading && this.isInitialized;
  }

  @computed
  get failed(): boolean {
    return this.error !== null;
  }

  @action.bound
  setLoading(): void {
    this.commit({ isLoading: true });
  }

  @action.bound
  setDone(): void {
    this.commit({ isLoading: false, isInitialized: true });
  }

  @action.bound
  setFailed(error: AxiosError<ResponseDto>): void {
    this.commit({ isLoading: false, isInitialized: true, error });
  }

  @action.bound
  clear(): void {
    this.commit({ isLoading: false, isInitialized: false, error: null });
  }
}
