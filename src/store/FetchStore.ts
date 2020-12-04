import { action, computed, makeObservable } from 'mobx';
import { AxiosError } from 'axios';
import { LeafStore } from '..';

export type FetchState<T> = {
  isLoading: boolean;
  isInitialized: boolean;
  error: AxiosError<T> | null;
};

export default class FetchStore<ResponseDto = any> extends LeafStore<FetchState<ResponseDto>> {
  constructor(label?: string) {
    super({ isLoading: false, isInitialized: false, error: null }, label);

    makeObservable(this, {
      isLoading: computed,
      isInitialized: computed,
      loaded: computed,
      failed: computed,
      setLoading: action,
      setDone: action,
      setFailed: action,
      clear: action,
    });
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get isInitialized(): boolean {
    return this.state.isInitialized;
  }

  get error(): AxiosError<ResponseDto> | null {
    return this.state.error;
  }

  get loaded(): boolean {
    return !this.isLoading && this.isInitialized;
  }

  get failed(): boolean {
    return this.error !== null;
  }

  setLoading(): void {
    this.commit({ isLoading: true });
  }

  setDone(): void {
    this.commit({ isLoading: false, isInitialized: true });
  }

  setFailed(error: AxiosError<ResponseDto>): void {
    this.commit({ isLoading: false, isInitialized: true, error });
  }

  clear(): void {
    this.commit({ isLoading: false, isInitialized: false, error: null });
  }
}
