import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import FetchStore from '../../../store/FetchStore';

interface FetchWrapperProps {
  fetch: FetchStore;
  isLoading: () => ReactElement;
  error: () => ReactElement;
  isInitialized: () => ReactElement;
}

const FetchWrapper = <T,>({ fetch, isLoading, error, isInitialized }: FetchWrapperProps): JSX.Element => {
  if (fetch.isLoading) {
    return isLoading();
  }

  if (fetch.isFailed) {
    return error();
  }

  if (fetch.isInitialized) {
    return isInitialized();
  }

  return <></>;
};

export default observer(FetchWrapper);
