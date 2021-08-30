## Description

[Rest-QL](https://github.com/Adel-ak/Rest-QL) A query language for your nodejs server (epressjs, nestjs etc)

Graphql is awesome but at the same time it can be a pain, If you havea love hate relation ship with graphql and want to move on to rest api, but you cant forget about some of graphql feature, well this package is for you.

Rest-QL is a tool, which was created to help you with query your endpoints, it does'nt replace how your current server looks or run's, it just helps you return what you need and also resolve your fields if needed in a cleaner way. please view the examples to understand what this package helps with.

## Installation

```bash
$ npm i @adelak/rest-ql
```

## `useSanitizeData`

useSanitizeData help in getting rid of the keys you dont need, which should should reduce in the amount of data begin send, just give it the your data from the data and your parsed query.

### NOTE: -

It would be much better of your got rid of unwanted data from the data base level, example if you are using mongodb. use your parsed query for your projections.

In the event you cant, useSanitizeData.

```
const user = {
    _id: 123,
    name: 'john',
    phone: 12345,
    age: 33,
    address: {
      house: 22,
      building: 34,
      street: 'Main street',
    },
  };

  const body = ` {
    _id
    name
    phone
    age
  }`;

  const [query] = useParseQuery(body);
  const [data, err] = useSanitizeData([user], query!);
  console.log(err); // contains error if any (null if no error)
  console.log(data); // [ { _id: 123, name: 'john', phone: 12345, age: 33 } ]
```

### Options

| Key               | Type    | Deault |
| ----------------- | ------- | ------ |
| allFieldsRequired | boolean | false  |
| removedNull       | boolean | true   |
| removeEmptyObjs   | boolean | true   |

## `useParseQuery`

useParseQuery will create key value pair which can be used to filter out unwanted keys from your db query.

### Example

```
import { useParseQuery } from '@adelak/rest-ql';

//Send the body in url query or request body (up to you where it comes from)
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
`

const option = {}

const [query, qureyError] = useParseQuery(body, option);


console.log(qureyError) // contains error if any (null if no error)
console.log(query) // contains query shape (null if there is a error)

// query out put
{
  _id: true,
  name: true,
  phone: true,
  address: {
    house: true,
    building: true,
    street: true
  }
}

// if option flatten is true object shape will be
{
  _id: true,
  name: true,
  phone: true,
  "address.house": true,
  "address.building": true,
  "address.street": true
}
```

### NOTE: -

```
  // if you are going to minimize the qurey size to max you make it look like this
  -->  {_id,name,phone,address{house,building,street,}}
  // make sure you you add a comma after each property else it will result to this
  --> { _idnamephoneaddress: { housebuildingstreet: true } }
```

### Options

| Key       | Type                        | Deault |
| --------- | --------------------------- | ------ |
| flatten   | boolean                     | false  |
| Paragraph | boolean \| string \| 0 \| 1 | true   |

## `useResolver`

useResolver helps with resolving your data and change the shape of it in a cleaner way

### Example

```
import { useResolver } from '@adelak/rest-ql';

type TAddress = {
    house: number | string;
    building: number;
    street: string;
  };

  type TUser = {
    _id: number;
    name: string;
    phone: string;
    address: TAddress;
  };

  type TState = {
    [key: string]: any;
  };

  // data from somewhere, mongodb, mysql, lala land. it doesnt matter
  const user = {
    _id: 123,
    name: 'jojo',
    phone: '123456789',
    address: {
      house: 83,
      building: 1,
      street: 'MAIN LANE',
    },
  };

  const addressResolver = {
    house: (rootData: TAddress, state: TState) => {
      const hideHouseNumber = state.hideHouseNumber;
      return hideHouseNumber ? 'Im not telling you my house number' : rootData.house;
    },
    building: (rootData: TAddress, state: TState) => {
      const hideHouseNumber = state.hideHouseNumber;
      const building = hideHouseNumber ? rootData.building + 1e2 : rootData.building;
      return `I live in building ${building}`;
    },
    street: (rootData: TAddress, state: TState) => {
      const hideHouseNumber = state.hideHouseNumber;
      const street = hideHouseNumber ? 'Cant remember' : rootData.street;
      return street;
    },
  };

  const useAddressResolver = async (rootData: TUser, state: TState) => {
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

  const [data, err] = await useResolver<TUser>(user, resolver);

  console.log(err); // contains error if any (null if no error)
  console.log(data); // contains query shape (null if there is a error)

  // data out put
  {
    _id: 123,
    name: 'Hi am jojo',
    phone: 'You can get to me on my call +902 - 123456789',
    address: {
      house: 'Im not telling you my house number',
      building: 'I live in building 101',
      street: 'Cant remember'
    }
  }
```

you can do more with useResolve, have a look at this examples

[Resolve data with dataLoader](https://github.com/Adel-ak/RestQL/tree/main/example/resolveData-withDataLoader.ts)

[Resolve data from array of objects](https://github.com/Adel-ak/RestQL/tree/main/example/resolveData-ArrayData.ts)

[Resolve data from object](https://github.com/Adel-ak/RestQL/tree/main/example/resolveData.ts)

[All](https://github.com/Adel-ak/RestQL/tree/main/example)

## Support

Rest-QL is an MIT-licensed open source project. It can grow with your help by making PR's and issue's.

Feel free to requrest for a feature.

## Stay in touch

- Author - [Adel AK](https://twitter.com/Adel_xoxo)

## License

Rest-QL is [MIT licensed](https://github.com/Adel-ak/Rest-QL/blob/main/LICENSE).
