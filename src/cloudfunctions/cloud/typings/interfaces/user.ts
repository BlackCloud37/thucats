import { User } from '../../controllers/user/db';

export type UserLoginResult = User;
export interface UserLoginRequest {
  avatarUrl?: string;
  nickName?: string;
}
