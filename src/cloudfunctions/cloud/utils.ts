import { Add, JsonDbObject, Role, Collections } from '@/typings/db';

export const roles2RoleSet = (roles: Role[]): Set<Role> => {
  if (roles.length === 0) {
    return new Set();
  }
  const roleSet = new Set(roles);
  if (roleSet.has('admin')) {
    roleSet.add('operator');
  }
  return roleSet;
};

export async function update<T extends JsonDbObject>(
  collectionName: Collections,
  newRecord: T,
  database?: any
): Promise<T> {
  const timestamp = Date.now();
  console.log('update', arguments);
  const { _id } = newRecord;
  if (!_id) {
    return Promise.reject(Error('newRecord must has `_id`'));
  }
  const _db = database ? database : db;
  const newRecordWithTime = {
    ...newRecord,
    _updateTime: timestamp
  };
  // @ts-ignore
  delete newRecordWithTime._id;
  await _db.collection(collectionName).doc(_id).update({
    data: newRecordWithTime
  });
  return { ...newRecordWithTime, _id };
}

export async function add<T>(
  collectionName: Collections,
  newRecord: Add<T>,
  database?: any
): Promise<string> {
  console.log('add', arguments);
  const _db = database ? database : db;
  const timestamp = Date.now();
  const newRecordWithTime = {
    ...newRecord,
    _createTime: timestamp,
    _updateTime: timestamp
  };
  const { _id } = await _db.collection(collectionName).add({
    data: newRecordWithTime
  });
  return _id;
}

export async function getById<T>(collectionName: Collections, _id: string): Promise<T> {
  console.log('getById', arguments);
  const { data } = await db.collection(collectionName).doc(_id).get();
  console.log('getById result', data);
  return data;
}

export function checkPermission(requiredRole: Role, roles: Role[]): boolean {
  console.log('checkpermission', 'roles', roles);
  if (!roles) {
    return false;
  }

  const roleSet = roles2RoleSet(roles);
  if (roleSet.has(requiredRole)) {
    return true;
  }
  return false;
}
