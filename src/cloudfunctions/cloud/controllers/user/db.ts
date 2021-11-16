// import { User } from '@/models/users';
import { JsonDbObject } from '../../typings/base';
import { add, getById, update } from '../../utils';

const COLLECTION_NAME = 'users';

export type Role = 'admin' | 'operator';
export interface User extends Partial<JsonDbObject> {
  nickName: string;
  avatarUrl: string;

  openid: string;
  roles: Role[];
}

export async function getCurrentUser(): Promise<User> {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  return getUserByOpenid(openid);
}

export async function updateUser(_id: string, newRecord: User): Promise<User> {
  return update(COLLECTION_NAME, _id, newRecord);
}

export async function addUser(newRecord: User): Promise<User> {
  return add(COLLECTION_NAME, newRecord);
}

export async function getUserByOpenid(openid: string): Promise<User> {
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

export async function getUserById(_id: string): Promise<User> {
  return getById(COLLECTION_NAME, _id);
}
