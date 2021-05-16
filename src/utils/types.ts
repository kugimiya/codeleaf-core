export interface Newable<T = any> extends Function {
  new(...args: any[]): T;
}
export type Primitive = string | number | object | boolean;
export type UnpackedArray<T> = T extends Array<infer U> ? U : T;

export type DeepGet<T extends string, O> = T extends `${infer A}.${infer B}`
  ? A extends keyof O
    ? DeepGet<B, O[A]>
    : never
  : T extends keyof O
    ? O[T]
    : never;

export type GlueToPath<K0 extends string, K1 extends string> = `${K0}${K1 extends '' ? '' : '.'}${K1}`;

export type DeepKeys<O> = O extends object
  ? {
    [K in keyof O]: O[K] extends Array<unknown>
      ? `${K & string}`
      : `${K & string}` | GlueToPath<K & string, DeepKeys<O[K]>>
  }[keyof O]
  : '';

export type DeepKeysFiltered<
  Union extends string,
  Dict extends object,
  FilterType = string,
> = {
  [K in Union]: DeepGet<K, Dict> extends FilterType ? K : never
}[Union];
