import { computed } from 'mobx';
import BaseStore from './BaseStore';

export type PaginationState = {
  limit: number;
  page: number;
};

export default class PaginationStore extends BaseStore<PaginationState> {
  constructor(label?: string) {
    super({ limit: 10, page: 1 }, label);
  }

  @computed
  get page(): PaginationState['page'] {
    return this.state.page;
  }

  @computed
  get limit(): PaginationState['limit'] {
    return this.state.limit;
  }
}
