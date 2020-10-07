import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import FetchStore from '../../../store/FetchStore';

interface FetchWrapperProps<T> {
  fetch: FetchStore<T>;
  isLoading: () => ReactElement;
  error: () => ReactElement;
  isInitialized: () => ReactElement;
}

const FetchWrapper = <T,>({ fetch, isLoading, error, isInitialized }: FetchWrapperProps<T>): JSX.Element => {
  if (fetch.isLoading) {
    return isLoading();
  }

  if (fetch.error) {
    return error();
  }

  if (fetch.isInitialized) {
    return isInitialized();
  }

  return <></>;
};

export default observer(FetchWrapper);
