import { getById, update } from '../../utils';
import { DbRequest } from '@/typings/db/request';

const COLLECTION_NAME = 'requests';

export async function updateRequest(_id: string, newRecord: DbRequest): Promise<DbRequest> {
  return update(COLLECTION_NAME, _id, newRecord);
}

export async function getRequestById(_id: string): Promise<DbRequest> {
  return getById(COLLECTION_NAME, _id);
}
