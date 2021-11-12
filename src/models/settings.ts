import { createModel } from '@rematch/core';
import type { RootModel } from './models';
import wxRequest from 'wechat-request';
import { callApi } from './apis';

export interface SettingState {
  navigationBarTitleText: string;
  associationName: string;
  slogan: string;
  associationIcon: string;
  associationLogo: string;
  associationIntroduction: string;
}

const initialState: SettingState = {
  navigationBarTitleText: '猫咪图鉴',
  associationName: '',
  slogan: '',
  associationIcon: '',
  associationLogo: '',
  associationIntroduction: ''
};

export const settings = createModel<RootModel>()({
  state: initialState,
  reducers: {
    settings(state, payload: Partial<SettingState>) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: (dispatch) => ({
    async fetchSettingsAsync() {
      const { data } = await callApi(
        wxRequest.get(`/settings`, {
          params: {
            limit: 1
          }
        })
      );
      console.log(data[0]);
      dispatch.settings.settings(data[0]);
    }
  })
});
