import React, { createContext, ReactNode } from 'react';
import { Newable } from '../utils/types';

export type ClassTuple<T = any> = {
  target: Newable<T> | T;
  args?: ConstructorParameters<Newable<T>>;
  instance?: boolean;
};

export type PageModuleConfig<Store, Service, Selector> = {
  store: [Newable<Store>, ClassTuple[] | null];
  service: [Newable<Service>, ClassTuple[] | null];
  selector: (store: Store, service: Service) => Selector;
};

export type PageModuleInstance<Store, Service, Selector> = {
  Store: Store;
  Service: Service;
  Provider: React.FC<{ children: ReactNode }>;
  Context: React.Context<Selector>;
  Selector: Selector;
};

export function ClassTupleCreator({ target, args = [], instance = false }: ClassTuple): ClassTuple['target'] {
  const TargetClass = target; // cause eslint ban constructor name starts with lowercase
  return instance ? target : new TargetClass(...args);
}

export function CreatePageModule<Store, Service, Selector>(
  moduleConfig: PageModuleConfig<Store, Service, Selector>,
): PageModuleInstance<Store, Service, Selector> {
  const [StoreClass, StoreDeps] = moduleConfig.store;
  const [ServiceClass, ServiceDeps] = moduleConfig.service;

  const createdStore = new StoreClass(...(StoreDeps || []).map(ClassTupleCreator));
  const createdService = new ServiceClass(...(ServiceDeps || []).map(ClassTupleCreator));

  const context = createContext<Selector>(
    moduleConfig.selector(createdStore, createdService),
  );

  return {
    Store: createdStore,
    Service: createdService,
    Provider: ({ children }) => (
      <context.Provider
        value={moduleConfig.selector(createdStore, createdService)}
      >
        {children}
      </context.Provider>
    ),
    Context: context,
    Selector: moduleConfig.selector(createdStore, createdService),
  };
}
