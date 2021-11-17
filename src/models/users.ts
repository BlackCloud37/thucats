import {
  EApplicationActions,
  EController,
  EUserActions,
  UserLoginRequest,
  UserLoginResult,
  UpdateApplicationRequest,
  UpdateApplicationResult,
  ApiRequest
} from '@/typings/interfaces';
import { createModel } from '@rematch/core';
import { showToast } from 'remax/wechat';
import { callApi, requestCloudApi } from './apis';
import type { RootModel } from './models';
import wxRequest from 'wechat-request';
import { Role, DbUser, DbRequest } from '@/typings/db';
import { checkPermission } from '@/cloudfunctions/cloud/utils';
import { default as _l } from 'lodash';

export interface UserState {
  user?: DbUser;
  permissionRequests: ApiRequest[];
  imageRequests: ApiRequest[];
}

const initialState: UserState = {
  permissionRequests: [],
  imageRequests: []
};

export const users = createModel<RootModel>()({
  state: initialState,
  reducers: {
    user(state, user: DbUser) {
      return {
        ...state,
        user
      };
    },
    requests(state, requests: ApiRequest[]) {
      // console.log(_l.filter(requests, (req) => req.requestType === 'permission'));
      return {
        ...state,
        permissionRequests: _l.filter(requests, (req) => req.requestType === 'permission'),
        imageRequests: _l.filter(requests, (req) => req.requestType === 'imageUpload')
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
        toast &&
          showToast({
            title: '未登录',
            icon: 'error'
          });
        return false; // not logged in
      }

      if (checkPermission(requiredRole, user.roles)) {
        return true;
      }

      toast &&
        showToast({
          title: '没有权限',
          icon: 'error'
        });
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
      console.log({ query });
      const { data } = await callApi(wxRequest.post('/requests/find', { query }));
      console.log(data);
      dispatch.users.requests(data);
    },

    async createRequestAsync(payload: { request: DbRequest }) {
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
