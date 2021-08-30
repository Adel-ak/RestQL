import { useParseQuery } from '../src/parseQuery';
import { useSanitizeData } from '../src/sanitizeData';

(() => {
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
  console.log(err);
  console.log(data);
})();
