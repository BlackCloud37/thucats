// import { User } from '@/models/users';
import { add, getById, update } from '../../utils';
import { Add, DbUser } from '@/typings/db';

const COLLECTION_NAME = 'users';

export async function getCurrentUser(): Promise<DbUser> {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  return getUserByOpenid(openid);
}

export async function updateUser(_id: string, newRecord: DbUser): Promise<DbUser> {
  return update(COLLECTION_NAME, _id, newRecord);
}

export async function addUser(newRecord: Add<DbUser>): Promise<string> {
  return add(COLLECTION_NAME, newRecord);
}

export async function getUserByOpenid(openid: string): Promise<DbUser> {
  const {
    data: [user]
  } = await db
    .collection('users')
    .where({
      openid
    })
    .get();
  console.log('get user by openid', user);
  return user;
}

export async function getUserById(_id: string): Promise<DbUser> {
  return getById(COLLECTION_NAME, _id);
}
