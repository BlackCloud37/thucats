import {
  EApplicationActions,
  EController,
  EUserActions,
  UserLoginRequest,
  UserLoginResult
} from '@/cloudfunctions/cloud/typings';
import { navigateTo } from '@/utils';
import { createModel } from '@rematch/core';
import { showToast } from 'remax/wechat';
import { callApi, requestCloudApi } from './apis';
import type { RootModel } from './models';
import wxRequest from 'wechat-request';
import {
  UpdateApplicationRequest,
  UpdateApplicationResult
} from '@/cloudfunctions/cloud/typings/interfaces';
import { Role, User } from '@/cloudfunctions/cloud/controllers/user/db';
import { Request } from '@/cloudfunctions/cloud/controllers/request/db';
import { roles2RoleSet } from '@/cloudfunctions/cloud/utils';

export interface UserState {
  user?: User;
  requests: Request[];
}

const initialState: UserState = {
  requests: []
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
    async loginAsync(payload: UserLoginRequest) {
      console.log('Login start');
      console.log(payload);
      requestCloudApi(EController.User, EUserActions.Login, payload)
        .then(async (result: UserLoginResult) => {
          console.log(result);
          dispatch.users.user(result);
        })
        .catch(console.error);
    },

    async getRequestsAsync() {
      const { checkPermission } = dispatch.users;
      console.log('Get Requests');
      if (!checkPermission({ requiredRole: 'operator' })) {
        console.error('No permission to get requests');
        return;
      }

      const query = {
        status: { $eq: 'pending' },
        ...(checkPermission({ requiredRole: 'admin' })
          ? {}
          : { requestType: { $neq: 'permission' } })
      };

      const { data } = await callApi(
        wxRequest.post('/requests/find', {
          data: { query }
        })
      );
      console.log(data);
      dispatch.users.requests(data);
    },

    async createRequestAsync(payload: { request: Request }) {
      const { request } = payload;
      console.log('Create Requests');
      const { data } = await callApi(
        wxRequest.post('/requests', {
          data: {
            // body
            data: [request]
          }
        })
      );
      console.log(data);
    },

    async updateRequestAsync(payload: UpdateApplicationRequest) {
      requestCloudApi(EController.Application, EApplicationActions.Update, payload)
        .then(async (result: UpdateApplicationResult) => {
          console.log(result);
        })
        .catch(console.error);
    }
  })
});
