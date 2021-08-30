export type TState = {
  [key: string]: any;
};

export type TResolverFn<RootType = any, StateType = TState, TRes = any | Promise<any>> = (
  root: RootType,
  state: StateType,
) => TRes;

export type TResolvers = Record<string, TResolverFn>;
