import { useResolver } from '../src/resolveData';

(async () => {
  type TAddress = {
    house: number | string;
    building: number;
    street: string;
  };

  type TUser = {
    _id: number;
    name: string;
    phone: string;
    privateAddress: boolean;
    address: TAddress;
  };

  type TState = {
    isAddressPrivate?: boolean;
    [key: string]: any;
  };

  // data from somewhere, mongodb, mysql, lala land. it doesnt matter
  const users = [
    {
      _id: 123,
      name: 'jojo',
      phone: '123456789',
      privateAddress: false,
      address: {
        house: 83,
        building: 1,
        street: 'MAIN LANE',
      },
    },
    {
      _id: 123,
      name: 'momo',
      phone: '123456789',
      privateAddress: true,
      address: {
        house: 83,
        building: 1,
        street: 'MAIN LANE',
      },
    },
  ];

  const addressResolver = {
    house: (rootData: TAddress, state: TState) => {
      const hideHouseNumber = state.isAddressPrivate;
      return hideHouseNumber ? 'Im not telling you my house number' : `My house number is ${rootData.house}`;
    },
    building: (rootData: TAddress, state: TState) => {
      const hideHouseNumber = state.isAddressPrivate;
      const building = hideHouseNumber ? rootData.building + 1e2 : rootData.building;
      return `I live in building ${building}`;
    },
    street: (rootData: TAddress, state: TState) => {
      const hideHouseNumber = state.isAddressPrivate;
      const street = hideHouseNumber ? 'Cant remember' : rootData.street;
      return street;
    },
  };

  const useAddressResolver = async (rootData: TUser) => {
    const state = { isAddressPrivate: rootData.privateAddress };
    // you can pass state from the root to another useResolver
    const [data, err] = await useResolver<TAddress>(rootData.address, addressResolver, state);
    if (err) {
      // handle error
      console.log(err);
    }
    return data;
  };

  const resolver = {
    name: (rootData: TUser, state: TState) => {
      // store any value in state to pass on to the next resolver;
      state.counteryCode = '+902';
      state.hideHouseNumber = true;
      const userName = rootData.name;
      return `Hi am ${userName}`;
    },
    phone: (rootData: TUser, state: TState) => {
      const userPhone = rootData.phone;
      return `You can get to me on my call ${state.counteryCode} - ${userPhone}`;
    },
    //you can also use useResolver on a nested resolver
    address: useAddressResolver,
  };

  const [data, err] = await useResolver<TUser>(users, resolver);
  console.log(err); // contains error if any (null if no error)
  console.log(data); // contains query shape (null if there is a error)
})();
