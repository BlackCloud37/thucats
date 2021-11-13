import { EController, EUserActions, UserLoginResult } from '@/cloudfunctions/cloud/typings';
import { createModel } from '@rematch/core';
import { requestCloudApi } from './apis';
import type { JsonDbObject, RootModel } from './models';

export interface User extends Partial<JsonDbObject> {
  openid: string;
  role: 999 | 100 | 0;
}

export interface UserState {
  user?: User;
}

const initialState: UserState = {};

export const users = createModel<RootModel>()({
  state: initialState,
  reducers: {
    user(state, user: User) {
      return {
        ...state,
        user
      };
    }
  },
  effects: (dispatch) => ({
    checkPermission(required: 'admin' | 'operator' | 'normal', state): boolean {
      if (required === 'normal') {
        return true;
      }
      const { user } = state.users;
      if (!user) {
        return false;
      }
      const { role } = user;
      const roleValue = {
        admin: 999,
        operator: 100,
        normal: 0
      }[required];
      if (role >= roleValue) {
        return true;
      }
      return false;
    },

    // 登录后才能用管理员功能及上传图片
    async loginAsync() {
      console.log('Login start');
      requestCloudApi(EController.User, EUserActions.Login)
        .then(async (result: UserLoginResult) => {
          console.log(result);
          dispatch.users.user(result);
        })
        .catch(console.error);
    }
  })
});
