type TState = {
  [key: string]: any;
};

type TResolverFn<RootType = any, StateType = TState> = (root: RootType, state: StateType) => any | Promise<any>;

type TResolvers = Record<string, TResolverFn>;

type TResolveRes<ResolveType> = [ResolveType | ResolveType[] | null, any | null];

async function resolveData<DataType, StateType = TState>(
  data: DataType | DataType[],
  resolvers: TResolvers,
  state: StateType,
) {
  const resolveState = state || {};
  if (Array.isArray(data)) {
    const arr = data.map(async (obj) => {
      for (const key in obj) {
        if (resolvers[key]) {
          const rData = await resolvers[key](obj, resolveState);
          obj[key] = rData;
        }
      }
      return obj;
    });
    return await Promise.all(arr);
  } else {
    const obj = data;
    for (const key in obj) {
      if (resolvers[key]) {
        const rData = await resolvers[key](obj, resolveState);
        obj[key] = rData;
      }
    }
    return obj;
  }
}

export async function useResolver<DataType = any, StateType = TState>(
  data: DataType | DataType[],
  resolvers: TResolvers,
  state?: StateType,
): Promise<TResolveRes<DataType>> {
  try {
    const resolvedData = await resolveData<DataType>(data, resolvers, state || {});
    return [resolvedData, null];
  } catch (error) {
    return [null, { error }];
  }
}
