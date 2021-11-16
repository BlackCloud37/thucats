import {
  EController,
  EUserActions,
  UserLoginRequest,
  UserLoginResult
} from '@/cloudfunctions/cloud/typings';
import { navigateTo } from '@/utils';
import { createModel } from '@rematch/core';
import { showToast } from 'remax/wechat';
import { requestCloudApi } from './apis';
import type { JsonDbObject, RootModel } from './models';

export type Role = 'admin' | 'operator';

export interface User extends Partial<JsonDbObject> {
  nickName: string;
  avatarUrl: string;

  openid: string;
  roles: Role[];
}

export interface Request extends Partial<JsonDbObject> {
  applicant: User;
  requestType: 'permission' | 'imageUpload';
  status: 'pending' | 'approved' | 'denied';
}

export interface UserState {
  user?: User;
  requests: Request[];
}

const initialState: UserState = {
  requests: [] // TODO: init requests with empty arr
};

const roles2RoleSet = (roles: Role[]): Set<Role> => {
  const roleSet = new Set(roles);
  if (roleSet.has('admin')) {
    roleSet.add('operator');
  }
  return roleSet;
};

export const users = createModel<RootModel>()({
  state: initialState,
  reducers: {
    user(state, user: User) {
      return {
        ...state,
        user
      };
    },
    requests(state, requests: Request[]) {
      // TODO: understand what happened here
      return {
        ...state,
        requests
      };
    }
  },
  effects: (dispatch) => ({
    // 传入需要的权限
    // 如果toast === true，则如果用户没有权限，会弹窗提示
    checkPermission(
      { requiredRole, toast = false }: { requiredRole: Role; toast?: boolean },
      state
    ): boolean {
      const { user } = state.users;
      if (!user) {
        showToast({
          title: '未登录',
          icon: 'error'
        }).then(() => navigateTo('profile'));
        return false; // not logged in
      }

      const { roles } = user;
      const roleSet = roles2RoleSet(roles);
      if (roleSet.has(requiredRole)) {
        return true;
      }
      if (toast) {
        showToast({
          title: '没有权限',
          icon: 'error'
        });
      }
      return false;
    },

    // 登录后才能用管理员功能及上传图片
    async loginAsync(payload: {
      userInfo: {
        nickName: string;
        avatarUrl: string;
      };
    }) {
      console.log('Login start');
      console.log(payload);
      const { userInfo } = payload;
      const req: UserLoginRequest = userInfo;
      requestCloudApi(EController.User, EUserActions.Login, req)
        .then(async (result: UserLoginResult) => {
          console.log(result);
          dispatch.users.user(result);
        })
        .catch(console.error);
    },

    async getRequests() {
      // TODO: 1. fetch all `pending` requests from server
      //       2. dispatch them to reducer `requests`
      // const fakeRequests: Request[] = [];
      // ...
    }
  })
});
