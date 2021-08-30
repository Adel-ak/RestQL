import { gql } from 'graphql-tag';
import { flatten } from 'flat';
import { TParseOptions, TQlQuery, TParseRes } from './types';
import { TObj, TUseRes } from '../types';

function parseQuery(qlQuery: TQlQuery, parseOptions?: TParseOptions) {
  try {
    if (qlQuery) {
      const options = Object.assign(
        {},
        {
          flatten: false,
          KeyVaule: true,
        },
        parseOptions || {},
      );
      let qureyObj;

      if (typeof qlQuery === 'string') {
        let qlString = qlQuery.trim();
        if (qlString.startsWith('{') || qlString.startsWith('body')) {
          if (qlString.startsWith('body')) {
            qlString = qlString.replace('body', '');
          }
        } else {
          throw {
            code: 'Syntax Error',
            message: 'Query must start with { or body {',
          };
        }
        qureyObj = gql`
          ${qlString}
        `.definitions;
      } else {
        qureyObj = qlQuery;
      }

      const body = Array.isArray(qureyObj) ? qureyObj : [qureyObj];
      const query = body.reduce((acc: TObj, item: TObj) => {
        item.selectionSet.selections.map((y: TObj) => {
          if (y.selectionSet) {
            acc[y.name.value] = parseQuery(y, options);
          } else {
            acc[y.name.value] = options.KeyVaule;
          }
        });
        return acc;
      }, {});

      const res = options.flatten ? flatten(query) : query;
      return res;
    } else {
      throw {
        code: 'bad-value',
      };
    }
  } catch (error) {
    if (error.code === 'bad-value') {
      throw {
        code: 'Syntax Error',
        message: 'Query string is required',
      };
    }

    if (error.message.includes('Syntax Error')) {
      throw {
        code: 'Syntax Error',
        message: error.message,
      };
    } else {
      throw {
        code: 'Unknown Error',
        message: error.message,
      };
    }
  }
}

export function useParseQuery<T = TObj>(qlQuery: TQlQuery, parseOptions?: TParseOptions): TUseRes<TParseRes<T>> {
  try {
    const parsedQuery = parseQuery(qlQuery, parseOptions);
    return [parsedQuery, null];
  } catch (error) {
    return [null, { error }];
  }
}
