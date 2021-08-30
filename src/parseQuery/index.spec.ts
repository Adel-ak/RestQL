import { useParseQuery } from './index';
import { TParseOptions } from './types';
import { flatten } from 'flat';

describe('Parse Query', () => {
  it('should parse', () => {
    const option: TParseOptions = {
      KeyVaule: true,
    };

    const bodyRes = {
      _id: option.KeyVaule,
      name: option.KeyVaule,
      phone: option.KeyVaule,
      address: {
        house: option.KeyVaule,
        building: option.KeyVaule,
        street: option.KeyVaule,
      },
    };

    const body = `
    {
      _id
      name
      phone
      address {
        house
        building
        street
      }
    }
    `;

    const [query, err] = useParseQuery(body, option);
    expect(query).toStrictEqual(bodyRes);
    expect(err).toBeNull();
  });

  it('should flat parse', () => {
    const option: TParseOptions = {
      KeyVaule: true,
      flatten: true,
    };

    const bodyRes = flatten({
      _id: option.KeyVaule,
      name: option.KeyVaule,
      phone: option.KeyVaule,
      address: {
        house: option.KeyVaule,
        building: option.KeyVaule,
        street: option.KeyVaule,
      },
    });

    const body = `
    {
      _id
      name
      phone
      address {
        house
        building
        street
      }
    }
    `;

    const [query, err] = useParseQuery(body, option);
    expect(query).toStrictEqual(bodyRes);
    expect(err).toBeNull();
  });

  it('should fail parse', () => {
    const option: TParseOptions = {
      KeyVaule: true,
      flatten: true,
    };

    const body = `
    s {
      _id
      name
      phone
      address {
        house
        building
        street
      }
    }
    `;

    const [query, err] = useParseQuery(body, option);
    expect(query).toBeNull();
    expect(err).toHaveProperty('error.code');
  });
});
