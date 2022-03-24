import { Add, JsonDbObject, Collections } from '@/typings/db';

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

export async function getById<T>(
  collectionName: Collections,
  _id: string,
  database?: any
): Promise<T> {
  console.log('getById', arguments);
  const _db = database ? database : db;
  const { data } = await _db.collection(collectionName).doc(_id).get();
  console.log('getById result', data);
  return data;
}
