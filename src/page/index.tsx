import { Newable } from '../utils/types';

export type ClassTuple<T = any> = {
  target: Newable<T> | T;
  args?: ConstructorParameters<Newable<T>>;
  instance?: boolean;
};

export type PageModuleConfig<Store, Service> = {
  store: [Newable<Store>, ClassTuple[] | null];
  service: [Newable<Service>, ClassTuple[] | null];
};

export type PageModuleInstance<Store, Service> = {
  Store: Store;
  Service: Service;
};

export function ClassTupleCreator({ target, args = [], instance = false }: ClassTuple): ClassTuple['target'] {
  const TargetClass = target; // cause eslint ban constructor name starts with lowercase
  return instance ? target : new TargetClass(...args);
}

export function CreatePageModule<Store, Service>(
  moduleConfig: PageModuleConfig<Store, Service>,
): PageModuleInstance<Store, Service> {
  const [StoreClass, StoreDeps] = moduleConfig.store;
  const [ServiceClass, ServiceDeps] = moduleConfig.service;

  const createdStore = new StoreClass(...(StoreDeps || []).map(ClassTupleCreator));
  const createdService = new ServiceClass(...(ServiceDeps || []).map(ClassTupleCreator));

  return {
    Store: createdStore,
    Service: createdService,
  };
}
