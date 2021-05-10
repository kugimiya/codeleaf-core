import { action, makeObservable, observable } from 'mobx';
import { DeepGet, DeepKeys } from '../utils.types';

export default class Store<T extends Record<string, unknown>> {
  state: T;
  private readonly initialState: T;

  constructor(initialState: T) {
    this.initialState = initialState;
    this.state = initialState;

    makeObservable(this, {
      state: observable,
      set: action.bound,
      resetState: action.bound,
    });
  }

  set<Keys extends DeepKeys<T> & string>(path: Keys, newValue: DeepGet<Keys, T>): void {
    const siblings = path.split(".");
    const lastIndex = siblings.length - 1;

    siblings.reduce(
      (chunk: unknown, nextChunkKey, currentChunkIndex) => {
        if (currentChunkIndex === lastIndex) {
          (chunk as Record<string, unknown>)[nextChunkKey] = newValue;
        }

        return (chunk as Record<string, unknown>)[nextChunkKey];
      }, this.state
    );
  }

  resetState(): void {
    this.state = { ...this.initialState };
  }
}