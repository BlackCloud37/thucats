import { DbRequest, DbUser } from '../db';

export interface UpdateApplicationRequest {
  requestId: string;
  action: 'approve' | 'deny';
}

export interface UpdateApplicationResult {
  _id: string;
}

export interface ApiRequest extends Omit<DbRequest, 'applicant'> {
  applicant: DbUser;
}
