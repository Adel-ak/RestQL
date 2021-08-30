import { TObj } from '../types';

export type TQlQuery = string | TObj;

export type TKeyVaule = string | 0 | 1 | boolean;

export type TParseOptions = {
  flatten?: boolean;
  KeyVaule?: TKeyVaule;
};

type TSanitize<T = TObj> = Record<keyof T, TKeyVaule>;

export type TParseRes<T = TObj> = Record<keyof T, TKeyVaule | TSanitize>;
