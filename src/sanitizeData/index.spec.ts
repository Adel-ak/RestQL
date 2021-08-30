import { useSanitizeData } from './index';
import { useParseQuery } from '../parseQuery';
import { TParseOptions } from 'src/parseQuery/types';

const checkIfKeyEsist = (data: any, query: Record<any, any>) => {
  const arrData = Array.isArray(data) ? data : [data];
  for (const item of arrData) {
    for (const key in query) {
      if (typeof query[key] === 'object') {
        checkIfKeyEsist(item[key], query[key]);
      } else {
        expect(item === undefined || !item.hasOwnProperty(key) || item.hasOwnProperty(key)).toBeTruthy();
      }
    }
  }
};

describe('Sanitize Data', () => {
  it('should parse, sanitize and return all keys', async () => {
    const option: TParseOptions = {
      KeyVaule: true,
    };

    const bodyRes = {
      name: option.KeyVaule,
      age: option.KeyVaule,
      phone: option.KeyVaule,
      address: {
        house: option.KeyVaule,
        building: option.KeyVaule,
      },
    };

    const body = `{
      name
      age
      phone
      address {
        house
        building
      },
    }`;

    const [query, err] = useParseQuery(body, option);
    expect(query).toStrictEqual(bodyRes);
    expect(err).toBeNull();

    const data = {
      name: 'Adel',
      age: 23,
      phone: 123456789,
      address: {
        house: 23,
        building: 102,
      },
    };

    const [sanitizeData, sanitizeDataErr] = useSanitizeData(data, query!, { allFieldsRequired: true });
    checkIfKeyEsist(sanitizeData, query!);
    expect(sanitizeDataErr).toBeNull();
  });

  it('should parse, sanitize found keys', async () => {
    const option: TParseOptions = {
      KeyVaule: true,
    };

    const bodyRes = {
      name: option.KeyVaule,
      age: option.KeyVaule,
      phone: option.KeyVaule,
      address: {
        house: option.KeyVaule,
        building: option.KeyVaule,
      },
    };

    const body = `{
      name
      age
      phone
      address {
        house
        building
      },
    }`;

    const [query, err] = useParseQuery(body, option);
    expect(query).toStrictEqual(bodyRes);
    expect(err).toBeNull();

    const data = {
      name: 'Adel',
      age: 23,
    };

    const [sanitizeData, sanitizeDataErr] = useSanitizeData(data, query!);

    checkIfKeyEsist(sanitizeData, query!);
    expect(sanitizeDataErr).toBeNull();
  });

  it('should parse, sanitize array of objects', async () => {
    const option: TParseOptions = {
      KeyVaule: true,
    };

    const bodyRes = {
      name: option.KeyVaule,
      age: option.KeyVaule,
      phone: option.KeyVaule,
      address: {
        house: option.KeyVaule,
        building: option.KeyVaule,
      },
    };

    const body = `{
      name
      age
      phone
      address {
        house
        building
      },
    }`;

    const [query, err] = useParseQuery(body, option);
    expect(query).toStrictEqual(bodyRes);
    expect(err).toBeNull();

    const data = [
      {
        name: 'Adel',
        age: 23,
      },
      {
        name: 'Jone',
        age: 33,
      },
    ];

    const [sanitizeData, sanitizeDataErr] = useSanitizeData([data], query!);
    checkIfKeyEsist(sanitizeData, query!);
    expect(sanitizeDataErr).toBeNull();
  });
});
