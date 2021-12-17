import { JsonDbObject } from '.';

export type Role = 'admin' | 'operator';

export interface DbUser extends JsonDbObject {
  nickName: string;
  avatarUrl: string;

  openid: string;
  roles: Role[];

  imageUploadCount: number;
}
