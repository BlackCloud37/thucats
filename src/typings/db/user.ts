import { JsonDbObject } from '.';

export type Role = 'admin' | 'operator';
export interface DbUser extends Partial<JsonDbObject> {
  nickName: string;
  avatarUrl: string;

  openid: string;
  roles: Role[];
}
