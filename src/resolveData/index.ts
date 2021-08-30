import { TUseRes } from '../types';
import { TResolvers, TState } from './types';

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

export async function useResolver<DataType = any>(
  data: DataType | DataType[],
  resolvers: TResolvers,
  state: TState = {},
): Promise<TUseRes<DataType | DataType[]>> {
  try {
    const resolvedData = await resolveData<DataType>(data, resolvers, state || {});
    return [resolvedData, null];
  } catch (error) {
    return [null, { error }];
  }
}
