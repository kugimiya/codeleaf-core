import { runInAction } from "mobx";
import { UnpackedArray } from "../utils.types";

export const lensWrapper = function <T extends Record<string, any> | Array<any>, Tmp = any>(obj: T, prevKey?: keyof Tmp, prevObj?: Tmp) { // TODO: fix 'Tmp' values
  return ({
    /**
     * Selector-function
     * @param key key of object
     */
    for<K extends keyof T>(key: K) {
      return lensWrapper<T[K]>(obj[key], key, obj);
    },

    /**
     * Setter-function
     * @param value value for selected field
     */
    set<K extends keyof T>(value: T[K]) {
      if (prevKey && prevObj) {
        runInAction(() => {
          prevObj[prevKey] = value as unknown as Tmp[keyof Tmp]; // TODO: fix this unknown
        });
      }
    },

    /**
     * Predicator-function, it allows you to modify elements that match with passed data
     * @param findBy partial object for searching
     */
    where<U extends UnpackedArray<T>>(findBy: Partial<U>) {
      const findPredicate = (item: U) => {
        let same = false;

        for (const findByKey in findBy) {
          if (Object.prototype.hasOwnProperty.call(findBy, findByKey)) {
            const findByValue = findBy[findByKey]; // TODO: add support for custom predicate-callbacks
            same = same || (findByValue === item[findByKey]);
          }
        }

        return same;
      };

      return ({
        /**
         * Setter-function wrapped by 'where' predicator, got specific functionality for arrays
         * @param value value for selected field
         */
        set(value: Partial<U>) {
          if (obj instanceof Array && prevKey && prevObj) {
            runInAction(() => {
              prevObj[prevKey] = (obj as T).map((item: U) => findPredicate(item) ? { ...item, ...value } : item) as unknown as Tmp[keyof Tmp]; // TODO: fix this unknown
            });
          }
        },
      });
    }
  })
}
