import { DbUser } from '@/typings/db';

export type UserLoginResult = DbUser;
export interface UserLoginRequest {
  avatarUrl?: string;
  nickName?: string;
}
