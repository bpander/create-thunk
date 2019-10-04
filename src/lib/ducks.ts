import { Reducer, combineReducers, ReducersMapObject } from 'redux';

export type GetBranch<T> = (rootState: any) => T;

export interface Duck<T> {
  reducer: Reducer<T>;
}

export interface DuckCreator<T> {
  (actionTypePrefix: string, getBranch: GetBranch<T>): Duck<T>;
}

export type ExtractState<TDuck> = TDuck extends Duck<infer S> ? S : never;

const keys = <T>(obj: T) => Object.keys(obj) as Array<keyof T>;
const join = (strings: (string | number | symbol)[], delimiter = '.') =>
  strings.filter(Boolean).join(delimiter);

export const combineDucks = <M extends { [key: string]: DuckCreator<any> }>(duckCreators: M) => {
  return (prefix: string, getBranch: GetBranch<{ [K in keyof M]: ExtractState<ReturnType<M[K]>>}>) => {
    const reducers = {} as ReducersMapObject<{ [K in keyof M]: ExtractState<ReturnType<M[K]>>}>;
    const extras = {} as { [K in keyof M]: ReturnType<M[K]> };
    keys(duckCreators).forEach(key => {
      extras[key] = duckCreators[key](join([ prefix, key ]), state => getBranch(state)[key]) as ReturnType<M[keyof M]>;
      reducers[key] = extras[key].reducer;
    });
    const reducer = combineReducers(reducers);
    return { reducer, ...extras };
  };
};
