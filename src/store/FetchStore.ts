import { action, computed, makeObservable } from 'mobx';
import Store from './Store';

export type FetchState = {
  isLoading: boolean;
  isInitialized: boolean;
  isFailed: boolean;
};

export default class FetchStore extends Store<FetchState> {
  constructor() {
    super({ isLoading: false, isInitialized: false, isFailed: false });

    makeObservable(this, {
      isLoading: computed,
      isInitialized: computed,
      isLoaded: computed,
      isFailed: computed,
      setLoading: action,
      setDone: action,
      setFailed: action,
    });
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get isInitialized(): boolean {
    return this.state.isInitialized;
  }

  get isFailed(): boolean {
    return this.state.isFailed;
  }

  get isLoaded(): boolean {
    return !this.isLoading && this.isInitialized;
  }

  setLoading(): void {
    this.set('isLoading', true);
  }

  setDone(): void {
    this.set('isLoading', false);
    this.set('isInitialized', true);
    this.set('isFailed', false);
  }

  setFailed(): void {
    this.set('isLoading', false);
    this.set('isInitialized', true);
    this.set('isFailed', true);
  }
}
