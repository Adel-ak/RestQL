import { Obj } from './types';

type TResolverFn<RootType = any> = (root: RootType, state?: Obj) => any | Promise<any>;

type TResolvers = Record<string, TResolverFn>;

async function resolveData<DataType>(data: DataType | DataType[], resolvers: TResolvers, state?: Obj) {
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

type TResolveRes<T> = [T | T[] | null, any];

export async function useResolver<DataType = any>(
  data: DataType | DataType[],
  resolvers: TResolvers,
  state?: Obj,
): Promise<TResolveRes<DataType>> {
  try {
    const resolvedData = await resolveData<DataType>(data, resolvers, state);
    return [resolvedData, null];
  } catch (error) {
    return [null, { error }];
  }
}
