import { gql } from 'graphql-tag';
import { flatten } from 'flat';

type Obj = Record<string, any>;
type TQqlQurey = string | Obj;
type TParseOptions = {
  flatten?: boolean;
  KeyVaule?: string | 0 | 1 | boolean;
};

function parseQurey(gqlQurey: TQqlQurey, parseOptions?: TParseOptions) {
  try {
    if (gqlQurey) {
      const options = Object.assign(
        {},
        {
          flatten: false,
          KeyVaule: true,
        },
        parseOptions || {},
      );
      let qureyObj;

      if (typeof gqlQurey === 'string') {
        let gqlString = gqlQurey.replace(/[\n \s]/g, '');
        if (gqlString.startsWith('{') || gqlString.startsWith('body')) {
          if (gqlString.startsWith('body')) {
            gqlString = gqlString.replace('body', '');
          }
        } else {
          throw {
            code: 'Syntax Error',
            message: 'Qurey must start with { or body {',
          };
        }
        qureyObj = gql`
          ${gqlString}
        `.definitions;
      } else {
        qureyObj = gqlQurey;
      }

      const body = Array.isArray(qureyObj) ? qureyObj : [qureyObj];
      const qurey = body.reduce((acc: Obj, item: Obj) => {
        item.selectionSet.selections.map((y: Obj) => {
          if (y.selectionSet) {
            acc[y.name.value] = parseQurey(y, options);
          } else {
            acc[y.name.value] = options.KeyVaule;
          }
        });
        return acc;
      }, {});

      const res = options.flatten ? flatten(qurey) : qurey;
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
        message: 'Qurey string is required',
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

type TQureyRes = [Obj | null, any];

export function useParseQurey(gqlQurey: TQqlQurey, parseOptions?: TParseOptions): TQureyRes {
  try {
    const parsedQurey = parseQurey(gqlQurey, parseOptions);
    return [parsedQurey, null];
  } catch (error) {
    return [null, { error }];
  }
}
