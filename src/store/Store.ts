import { action, makeObservable, observable } from 'mobx';
import { DeepGet, DeepKeys, DeepKeysFiltered, UnpackedArray } from '../utils/types';

export default class Store<T extends Record<string, unknown>> {
  /**
   * Store state
   */
  state: T;

  /**
   * Store initial state
   */
  private readonly initialState: T;

  constructor(initialState: T) {
    this.initialState = initialState;
    this.state = initialState;

    makeObservable(this, {
      state: observable,
      set: action.bound,
      setItem: action.bound,
      _setInPath: action.bound,
      resetState: action.bound,
    });
  }

  /**
   * Set value to store subtree.
   * @param path subtree path
   * @param newValue value
   */
  set<Keys extends DeepKeys<T>>(path: Keys, newValue: DeepGet<Keys, T>): void {
    this._setInPath(path, () => newValue);
  }

  /**
   * Set value to array item. For example, Array<{ id: number; name: string }>.
   * When you need to update an element with { id: 4 }, then you should use this method.
   * 
   * @param path subtree path
   * @param compareFn callback to find an item to be updated
   * @param newValue value of item
   */
  setItem<
    Keys extends DeepKeysFiltered<
      DeepKeys<T>, T, Array<unknown>
    >,
    ItemType = UnpackedArray<DeepGet<Keys, T>>
  >(
    path: Keys, 
    compareFn: (item: ItemType) => boolean,
    newValue: Partial<UnpackedArray<DeepGet<Keys, T>>>
  ): void {
    this._setInPath(path, (item) => (
      (item as ItemType[])
        .map((item) => compareFn(item) ? { ...item, ...newValue } : item)
    ));
  }

  /**
   * Search subtree in path and set value, returned by callback. Very internal thing.
   * 
   * @param path subtree path
   * @param cb return new value for founded subtree
   */
  _setInPath<Keys extends DeepKeys<T>>(path: Keys, cb: (item: DeepGet<Keys, T>) => void): void {
    const siblings = path.split(".");
    const lastIndex = siblings.length - 1;

    siblings.reduce(
      (chunk: unknown, nextChunkKey, currentChunkIndex) => {
        if (currentChunkIndex === lastIndex) {
          (chunk as Record<string, unknown>)[nextChunkKey] = cb(
            (chunk as Record<string, unknown>)[nextChunkKey] as DeepGet<Keys, T>
          );
        }

        return (chunk as Record<string, unknown>)[nextChunkKey];
      }, this.state
    );
  }

  /**
   * Just set store to its initial state.
   */
  resetState(): void {
    this.state = { ...this.initialState };
  }
}
