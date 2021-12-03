import {
  EApplicationActions,
  EController,
  EUserActions,
  UserLoginRequest,
  UserLoginResult,
  UpdateApplicationRequest,
  ApiRequest
} from '@/typings/interfaces';
import { createModel } from '@rematch/core';
import { showToast } from 'remax/wechat';
import { callApi, requestCloudApi } from './apis';
import type { RootModel } from './models';
import wxRequest from 'wechat-request';
import { Role, DbUser, DbRequest, Add } from '@/typings/db';
import { checkPermission } from '@/cloudfunctions/cloud/utils';
import filter from 'lodash.filter';

export interface UserState {
  user?: DbUser;
  isLoggedin: boolean;
  isOperator: boolean;
  isAdmin: boolean;
  permissionRequests: ApiRequest[];
  imageRequests: ApiRequest[];
}

const initialState: UserState = {
  isLoggedin: false,
  isOperator: false,
  isAdmin: false,
  permissionRequests: [],
  imageRequests: []
};

export const users = createModel<RootModel>()({
  state: initialState,
  reducers: {
    permission(state, { isOperator, isAdmin }: { isOperator: boolean; isAdmin: boolean }) {
      return {
        ...state,
        isOperator,
        isAdmin
      };
    },
    user(state, user: DbUser) {
      return {
        ...state,
        user,
        isLoggedin: !!user
      };
    },
    requests(state, requests: ApiRequest[]) {
      return {
        ...state,
        permissionRequests: filter(requests, (req) => req.requestType === 'permission'),
        imageRequests: filter(requests, (req) => req.requestType === 'imageUpload')
      };
    },
    removeReq(state, _id) {
      const { permissionRequests } = state;
      return {
        ...state,
        permissionRequests: filter(permissionRequests, (req) => req._id !== _id),
        imageRequests: filter(permissionRequests, (req) => req._id !== _id)
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

          const isOperator = dispatch.users.checkPermission({ requiredRole: 'operator' });
          const isAdmin = dispatch.users.checkPermission({ requiredRole: 'admin' });
          dispatch.users.permission({ isAdmin, isOperator });
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

    async createRequestAsync(payload: Pick<DbRequest, 'requestType' | 'permissionInfo'>, state) {
      if (!state.users.user?._id) {
        console.error('not logged in, cannot create request');
        return Promise.reject(Error('not logged in'));
      }

      const { requestType } = payload;
      console.log('Create Requests', arguments);
      let request: Add<DbRequest> = {
        requestType,
        status: 'pending',
        applicant: state.users.user._id
      };
      // argument check
      if (requestType === 'permission') {
        const { permissionInfo } = payload;
        if (
          !permissionInfo ||
          !permissionInfo.name ||
          !permissionInfo.department ||
          !permissionInfo.schoolID
        ) {
          console.error('no permission info');
          return Promise.reject(Error('no permission info'));
        }

        request = {
          ...request,
          permissionInfo
        };
      }

      const { data } = await callApi(
        wxRequest.post('/requests', {
          data: request
        })
      );
      console.log(data);
    },

    async updateRequestAsync(payload: UpdateApplicationRequest) {
      const { requestId } = payload;
      await requestCloudApi(EController.Application, EApplicationActions.Update, payload);
      dispatch.users.removeReq(requestId);
    }
  })
});
