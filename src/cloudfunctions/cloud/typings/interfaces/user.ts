import { User } from '@/models/users';

export type UserLoginResult = User;
export interface UserLoginRequest {
  avatarUrl?: string;
  nickName?: string;
}
