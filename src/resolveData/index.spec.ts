import { useResolver } from './index';
import { TResolverFn } from './types';

describe('Resolve Data', () => {
  it('should resolve as per resolver', async () => {
    const data = {
      name: 'Adel',
      age: 23,
    };

    const resolver: Record<string, TResolverFn> = {
      name: (rootData: typeof data) => {
        return `Hi, im ${rootData.name}`;
      },
    };

    const [resolverData, resolverDataErr] = await useResolver(data, resolver);
    expect(resolverData).toMatchObject(data);
    expect(resolverDataErr).toBeNull();
  });

  it('should strict equal resolve as per resolver', async () => {
    const data = {
      name: 'Adel',
      age: 23,
    };

    const resolver: Record<string, TResolverFn> = {
      name: (rootData: typeof data) => {
        return `Hi, im ${rootData.name}`;
      },
      age: (rootData: typeof data) => {
        return rootData.age + 2;
      },
    };

    const resolverTo = {
      name: resolver.name(data, {}),
      age: resolver.age(data, {}),
    };

    const [resolverData, resolverDataErr] = await useResolver(data, resolver);
    expect(resolverData).toStrictEqual(resolverTo);
    expect(resolverDataErr).toBeNull();
  });

  it('should error', async () => {
    const data = {
      name: 'Adel',
      age: 23,
    };

    const resolver: Record<string, TResolverFn> = {
      name: (rootData: typeof data) => {
        return `Hi, im ${rootData.name}`;
      },
      age: (rootData: typeof data) => {
        throw new Error('oops');
        return rootData.age + 2;
      },
    };

    const [resolverData, resolverDataErr] = await useResolver(data, resolver);
    expect(resolverData).toBeNull();
    expect(resolverDataErr).toHaveProperty('error');
  });
});
