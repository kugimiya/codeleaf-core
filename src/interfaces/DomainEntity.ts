import { Order } from '../enums/order';
import { JSONPatch } from './JSONPatch';

export interface IEntity {
    id: number;
}

export interface IFilters<Entity> {
    _page?: number;
    _limit?: number;
    _sort?: keyof Entity;
    _order?: Order;
}

export interface DomainEntityMethod<PathPlaceholders, GetParams, Body, Response> {
    PathPlaceholders: PathPlaceholders;
    GetParams: GetParams;
    Body: Body;
    Response: Response;
}

export interface DomainEntity<Entity extends IEntity> {
    Create: DomainEntityMethod<null, null, Omit<Entity, 'id'>, Entity>;
    Read: DomainEntityMethod<IEntity, null, null, Entity>;
    ReadAll: DomainEntityMethod<null, IFilters<Entity> & Partial<Entity>, null, Entity[]>;
    Update: DomainEntityMethod<IEntity, null, JSONPatch[], null>
    Delete: DomainEntityMethod<IEntity, null, null, null>;
}
