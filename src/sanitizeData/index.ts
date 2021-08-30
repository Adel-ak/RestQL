import { TParseRes } from '../parseQuery/types';
import { isEmpty, toArray } from '../utils';
import { TObj, TUseRes } from '../types';
import { TSanitizeOptions } from './types';

const findMissingFields = (data: TObj, sData: TObj, index: number | null) => {
  const mObj = Object.keys(data);
  const sObj = Object.keys(sData);
  for (const key in sObj) {
    const field = sObj[key];
    if (!mObj.includes(field)) {
      throw {
        code: 'Missing field',
        message: `Field name "${field}" is missing${index !== null ? ` at index ${index}` : ''}`,
      };
    }
  }
};

const sanitizeData = (data: TObj, sObj: TObj, sanitizeOptions?: TSanitizeOptions) => {
  const options = Object.assign(
    {},
    {
      allFieldsRequired: false,
      removedNull: true,
      removeEmptyObjs: true,
    },
    sanitizeOptions || {},
  );
  const state: TObj[] = [];
  const isArray = Array.isArray(data);
  const mObj = toArray(data);
  for (let elIndex = 0; elIndex < mObj.length; elIndex++) {
    const mObjItem = mObj[elIndex];
    if (options.allFieldsRequired) {
      findMissingFields(mObjItem, sObj, isArray ? elIndex : null);
    }
    state[elIndex] = {};
    for (const key in sObj) {
      const sObjItem = sObj[key];
      if (typeof sObjItem === 'object') {
        const sNestObj = sanitizeData(mObjItem[key] ? mObjItem[key] : {}, sObjItem, options);
        if (options.removeEmptyObjs && isEmpty(sNestObj)) {
          continue;
        }
        state[elIndex][key] = sNestObj;
      } else {
        if (options.removedNull && mObjItem && !mObjItem[key]) {
          continue;
        }
        state[elIndex][key] = mObjItem[key] ? mObjItem[key] : null;
      }
    }
  }

  return isArray ? state : state[0];
};

export function useSanitizeData<TData>(
  data: TData,
  sObj: TParseRes,
  sanitizeOptions?: TSanitizeOptions,
): TUseRes<TData> {
  try {
    const sanitizedData = sanitizeData(data, sObj, sanitizeOptions) as TData;
    return [sanitizedData, null];
  } catch (error) {
    return [null, { error }];
  }
}
