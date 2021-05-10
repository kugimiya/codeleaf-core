import React from 'react';
import { Newable } from '../utils/types';

export type ClassTuple<T = any> = {
  target: Newable<T> | T;
  args?: ConstructorParameters<Newable<T>>;
  instance?: boolean;
};

export type PageModuleConfig<Store, Service> = {
  path: string;
  component: React.FC;
  store: [Newable<Store>, ClassTuple[] | null];
  service: [Newable<Service>, ClassTuple[] | null];
};

export type PageModuleInstance<Store, Service> = {
  Component: React.FC;
  Store: Store;
  Service: Service;
};

export function ClassTupleCreator({ target, args = [], instance = false }: ClassTuple): ClassTuple['target'] {
  return instance ? target : new target(...args);
}

export function CreatePageModule<Store, Service>(moduleConfig: PageModuleConfig<Store, Service>): PageModuleInstance<Store, Service> {
  const [StoreClass, StoreDeps] = moduleConfig.store;
  const [ServiceClass, ServiceDeps] = moduleConfig.service;

  const createdStore = new StoreClass(...(StoreDeps || []).map(ClassTupleCreator));
  const createdService = new ServiceClass(...(ServiceDeps || []).map(ClassTupleCreator));

  const Component = moduleConfig.component;

  return {
    Component,
    Store: createdStore,
    Service: createdService,
  };
}
