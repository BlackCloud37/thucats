import { EController, EUserActions, UserOpenidResult } from '@/cloudfunctions/cloud/typings';
import { createModel } from '@rematch/core';
import { requestCloudApi } from './apis';
import type { RootModel } from './models';

export interface UserState {
  openid: string;
}

const initialState: UserState = {
  openid: ''
};

export const users = createModel<RootModel>()({
  state: initialState,
  reducers: {
    openid(state, payload: Partial<UserState>) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: (dispatch) => ({
    async fetchOpenidAsync() {
      console.log('Fecth openid start.');
      requestCloudApi(EController.User, EUserActions.GetOpenid)
        .then(async (result: UserOpenidResult) => {
          dispatch.users.openid({ openid: result.openid });
        })
        .catch(console.error);
    }
  })
});
