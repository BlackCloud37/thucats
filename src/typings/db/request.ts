import { JsonDbObject } from '.';

export interface DbRequest extends JsonDbObject {
  applicant: string;
  requestType: 'imageUpload';
  status: 'pending' | 'approved' | 'denied';
  imageUploadInfo?: {
    catID: string;
    filePaths: string[];
    _createTime: number;
    catName: string;
  };
}
