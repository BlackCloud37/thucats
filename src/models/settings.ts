import { createModel } from '@rematch/core';
import type { RootModel } from './models';
import wxRequest from 'wechat-request';
import { callApi } from './apis';
import { DbSetting } from '@/typings/db/setting';

export type SettingState = DbSetting;

const initialState: SettingState = {
  navigationBarTitleText: '猫咪图鉴',
  associationName: '',
  slogan: '',
  associationIcon: '',
  associationLogo: '',
  associationIntroduction: '',
  adoptGuideUrl: '',
  filterIconIcons: []
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
      const {
        data: [setting]
      } = await callApi(
        wxRequest.get(`/settings`, {
          params: {
            limit: 1
          }
        })
      );
      console.log(setting);
      dispatch.settings.settings(setting);
    }
  })
});
