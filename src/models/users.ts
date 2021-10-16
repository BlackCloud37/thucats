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
      requestCloudApi('helloworld')
        .then((result) => {
          const res = result as { openid: string };
          dispatch.users.openid({ openid: res.openid });
        })
        .catch(console.error);
    }
  })
});
