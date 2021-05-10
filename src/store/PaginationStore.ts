import { computed, makeObservable } from 'mobx';
import Store from './Store';

export type PaginationState = {
  limit: number;
  page: number;
};

export default class PaginationStore extends Store<PaginationState> {
  constructor() {
    super({ limit: 10, page: 1 });

    makeObservable(this, {
      page: computed,
      limit: computed,
    });
  }

  get page(): PaginationState['page'] {
    return this.state.page;
  }

  get limit(): PaginationState['limit'] {
    return this.state.limit;
  }
}
