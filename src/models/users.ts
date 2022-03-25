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
import { DbUser, DbRequest, Add } from '@/typings/db';
import filter from 'lodash.filter';

export interface UserState {
  user?: DbUser;
  isLoggedin: boolean;
  isAdmin: boolean;
  imageRequests: ApiRequest[];
  myRequests: ApiRequest[];
}

const initialState: UserState = {
  isLoggedin: false,
  isAdmin: false,
  imageRequests: [],
  myRequests: []
};

export const users = createModel<RootModel>()({
  state: initialState,
  reducers: {
    isAdmin(state, { isAdmin }: { isAdmin: boolean }) {
      return {
        ...state,
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
        imageRequests: filter(requests, (req) => req.requestType === 'imageUpload')
      };
    },
    removeReq(state, _id) {
      const { imageRequests } = state;
      return {
        ...state,
        imageRequests: filter(imageRequests, (req) => req._id !== _id)
      };
    },
    myRequests(state, myRequests: ApiRequest[]) {
      return {
        ...state,
        myRequests
      };
    }
  },
  effects: (dispatch) => ({
    // 传入需要的权限
    // 如果toast === true，则如果用户没有权限，会弹窗提示
    checkPermission({ toast = false }, state): boolean {
      const { user } = state.users;
      if (!user) {
        toast &&
          showToast({
            title: '未登录',
            icon: 'error'
          });
        return false; // not logged in
      }

      if (user.isAdmin) {
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

          const isAdmin = dispatch.users.checkPermission({});
          dispatch.users.isAdmin({ isAdmin });
        })
        .catch(console.error);
    },

    async getRequestsAsync() {
      const { checkPermission } = dispatch.users;
      console.log('Get Requests');
      if (!checkPermission({})) {
        console.error('No permission to get requests');
        return;
      }

      const query = {
        status: { $eq: 'pending' }
      };

      const { data } = await callApi(wxRequest.post('/requests/find', { query }));
      console.log(data);
      dispatch.users.requests(data);
    },

    async createRequestAsync(payload: Omit<DbRequest, '_id' | 'applicant' | 'status'>, state) {
      if (!state.users.user?._id) {
        console.error('not logged in, cannot create request');
        return Promise.reject(Error('not logged in'));
      }

      console.log('Create Requests', arguments);
      const { requestType } = payload;

      let request: Add<DbRequest> = {
        requestType,
        status: 'pending',
        applicant: state.users.user._id
      };

      if (requestType === 'imageUpload') {
        const { catID, filePaths } = payload;
        if (!catID || !filePaths || filePaths.length === 0) {
          console.error('no image upload info');
          return Promise.reject(Error('no image upload info'));
        }

        request = {
          ...request,
          catID,
          filePaths
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
    },

    async getMyRequestsAsync(_, state) {
      const { _id } = state.users.user ?? {};
      if (!_id) {
        console.error('not logged in, cannot create request');
        return Promise.reject(Error('not logged in'));
      }

      const { data } = await callApi(
        wxRequest.post('/requests/find', {
          query: {
            applicant: { $eq: _id }
          }
        })
      );
      dispatch.users.myRequests(data);
    }
  })
});
