import React, { ReactElement, FC } from 'react';
import { observer } from 'mobx-react-lite';
import FetchStore from '../../../store/FetchStore';

interface FetchWrapperProps {
  fetch: FetchStore;
  isLoading: () => ReactElement;
  error: () => ReactElement;
  isInitialized: () => ReactElement;
}

const FetchWrapper: FC<FetchWrapperProps> = ({
  fetch, isLoading, error, isInitialized,
}) => {
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
