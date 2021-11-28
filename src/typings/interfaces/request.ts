import { DbRequest, DbUser } from '../db';

export const enum EApplicationActions {
  // 同意、取消申请
  Update = 'update'
}

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
