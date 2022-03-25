import { JsonDbObject } from '.';

export interface DbRequest extends JsonDbObject {
  applicant: string;
  requestType: 'imageUpload';
  status: 'pending' | 'approved' | 'denied';

  catID?: string;
  filePaths?: string[];
}
