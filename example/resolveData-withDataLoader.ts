import DataLoader from 'dataloader';
import { useResolver } from '../src/resolveData';
import { friends as friendsDB } from '../example/data/friends';

type TFriend = {
  _id: number;
  name: string;
};
const findUsers = async (ids: readonly number[]): Promise<TFriend[]> => {
  return new Promise((res) => {
    const data = friendsDB.filter((x) => ids.includes(x._id));
    setTimeout(() => {
      res(data);
    }, 2000);
  });
};

const myBatchGetUsers = async (ids: readonly number[]) => {
  const friends = await findUsers(ids);
  return ids.map((x) => {
    const friendIndex = friends.findIndex((y) => y._id === x);
    const friend = friends[friendIndex];
    return friend;
  });
};

const userLoader = new DataLoader((ids: readonly number[]) => myBatchGetUsers(ids));

(async () => {
  type TUser = {
    _id: number;
    name: string;
    bestFriend: number;
  };

  // data from somewhere, mongodb, mysql, lala land. it doesnt matter
  const user = [
    {
      _id: 123,
      name: 'jojo',
      bestFriend: 2,
    },
    {
      _id: 456,
      name: 'meme',
      bestFriend: 4,
    },
    {
      _id: 789,
      name: 'tati',
      bestFriend: 6,
    },
    {
      _id: 101,
      name: 'tati',
      bestFriend: 8,
    },
    {
      _id: 112,
      name: 'tati',
      bestFriend: 10,
    },
  ];

  const resolver = {
    name: (rootData: TUser) => {
      const userName = rootData.name;
      return `Hi am ${userName}`;
    },
    bestFriend: async (rootData: TUser) => {
      const bfID = rootData.bestFriend;
      const user = await userLoader.load(bfID);
      return user;
    },
  };

  const [data, err] = await useResolver<TUser>(user, resolver);
  console.log(err); // contains error if any (null if no error)
  console.log(data); // contains query shape (null if there is a error)
})();
