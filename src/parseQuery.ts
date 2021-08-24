import { gql } from 'graphql-tag';
import { flatten } from 'flat';

type Obj = Record<string, any>;
type TQlQuery = string | Obj;
type TParseOptions = {
  flatten?: boolean;
  KeyVaule?: string | 0 | 1 | boolean;
};

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
      const query = body.reduce((acc: Obj, item: Obj) => {
        item.selectionSet.selections.map((y: Obj) => {
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

type TQueryRes = [Obj | null, any];

export function useParseQuery(qlQuery: TQlQuery, parseOptions?: TParseOptions): TQueryRes {
  try {
    const parsedQuery = parseQuery(qlQuery, parseOptions);
    return [parsedQuery, null];
  } catch (error) {
    return [null, { error }];
  }
}
