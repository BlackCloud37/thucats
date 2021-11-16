import { JsonDbObject } from '../../typings';
import { getById, update } from '../../utils';

const COLLECTION_NAME = 'requests';

export interface Request extends Partial<JsonDbObject> {
  applicant: string;
  requestType: 'permission' | 'imageUpload';
  status: 'pending' | 'approved' | 'denied';
}

export async function updateRequest(_id: string, newRecord: Request): Promise<Request> {
  return update(COLLECTION_NAME, _id, newRecord);
}

export async function getRequestById(_id: string): Promise<Request> {
  return getById(COLLECTION_NAME, _id);
}
