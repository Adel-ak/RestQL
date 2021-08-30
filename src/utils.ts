import { TObj } from './types';

export const isEmpty = (data: TObj) => {
  const obj = Object.keys(data);
  return obj.length === 0;
};

export const toArray = (data: TObj | TObj[]): TObj[] => {
  const isArray = Array.isArray(data);
  return isArray ? (data as Array<TObj>) : [data as TObj];
};
