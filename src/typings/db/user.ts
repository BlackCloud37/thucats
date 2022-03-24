import { JsonDbObject } from '.';

export interface DbUser extends JsonDbObject {
  nickName: string;
  avatarUrl: string;

  openid: string;
  isAdmin: boolean;

  name?: string;
  department?: string;
  studentID?: string;

  imageUploadCount: number;
}
