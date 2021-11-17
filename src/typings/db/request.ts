import { JsonDbObject } from '.';

export interface DbRequest extends JsonDbObject {
  applicant: string;
  requestType: 'permission' | 'imageUpload';
  status: 'pending' | 'approved' | 'denied';
}
