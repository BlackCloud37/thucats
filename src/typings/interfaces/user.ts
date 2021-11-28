import { DbUser } from '@/typings/db';

export const enum EUserActions {
  Login = 'login'
}

export type UserLoginResult = DbUser;
export interface UserLoginRequest {
  avatarUrl?: string;
  nickName?: string;
}
