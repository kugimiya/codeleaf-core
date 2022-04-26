import { computed, makeObservable } from 'mobx';

import Store from './Store';

export type PaginationState = {
  limit: number;
  page: number;
  count: number;
};

export default class PaginationStore extends Store<PaginationState> {
  constructor() {
    super({ limit: 10, page: 1, count: 0 });

    makeObservable(this, {
      page: computed,
      limit: computed,
      count: computed,
    });
  }

  get count(): PaginationState['count'] {
    return this.state.count;
  }

  get page(): PaginationState['page'] {
    return this.state.page;
  }

  get limit(): PaginationState['limit'] {
    return this.state.limit;
  }
}
