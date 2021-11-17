import { JsonDbObject } from '.';

export interface DbRequest extends Partial<JsonDbObject> {
  applicant: string;
  requestType: 'permission' | 'imageUpload';
  status: 'pending' | 'approved' | 'denied';
}
