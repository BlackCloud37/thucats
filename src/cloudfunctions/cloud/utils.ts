// import { Role, roles2RoleSet, User } from '@/models/users';

import { Role, User } from './controllers/user/db';

export const roles2RoleSet = (roles: Role[]): Set<Role> => {
  const roleSet = new Set(roles);
  if (roleSet.has('admin')) {
    roleSet.add('operator');
  }
  return roleSet;
};

export async function update<T extends { _id?: string }>(
  collectionName: string,
  _id: string,
  newRecord: T
): Promise<T> {
  console.log('update', arguments);
  delete newRecord._id;
  await db.collection(collectionName).doc(_id).update({
    data: newRecord
  });
  return { ...newRecord, _id };
}

export async function add<T>(collectionName: string, newRecord: T): Promise<T> {
  console.log('add', arguments);
  await db.collection(collectionName).add({
    data: newRecord
  });
  return newRecord;
}

export async function getById<T>(collectionName: string, _id: string): Promise<T> {
  console.log('getById', arguments);
  const { data } = await db.collection(collectionName).doc(_id).get();
  console.log('getById result', data);
  return data;
}

export function checkPermission(requiredRole: Role, user: User): boolean {
  console.log('checkpermission', 'user', user);
  if (!user) {
    console.log('no such user');
    return false;
  }

  const { roles } = user;
  const roleSet = roles2RoleSet(roles);
  if (roleSet.has(requiredRole)) {
    return true;
  }
  return false;
}
