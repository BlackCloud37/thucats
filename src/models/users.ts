import { UserOpenidResponse as UserOpenidResult } from '@/cloudfunctions/cloud/typings';
import { createModel } from '@rematch/core';
import { requestCloudApi } from './apis';
import type { RootModel } from './models';

// eslint-disable-next-line no-promise-executor-return
const asyncDelay = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
      await asyncDelay(1000);
      requestCloudApi('user', 'openid')
        .then((result: UserOpenidResult) => {
          dispatch.users.openid({ openid: result.openid });
        })
        .catch(console.error);
    }
  })
});
