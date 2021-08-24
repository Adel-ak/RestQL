import { useParseQuery } from '../src/parseQuery';

(async () => {
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
    `;

  const option = {};

  const [query, qureyError] = useParseQuery(body, option);

  console.log(qureyError); // contains error if any (null if no error)
  console.log(query); // contains query shape (null if there is a error)

  // query out put
  // {
  //   _id: true,
  //   name: true,
  //   phone: true,
  //   address: {
  //     house: true,
  //     building: true,
  //     street: true
  //   }
  // }

  // if option flatten is true object shape will be
  // {
  //  _id: true,
  //  name: true,
  //  phone: true,
  //  "address.house": true,
  //  "address.building": true,
  //  "address.street": true
  // }

  //NOTE
  //if you are going to minimize the qurey size to max you make it look like this
  //  {_id,name,phone,address{house,building,street,}}
  //make sure you you add a comma after each property else it will result to this
  // { _idnamephoneaddress: { housebuildingstreet: true } }
})();
