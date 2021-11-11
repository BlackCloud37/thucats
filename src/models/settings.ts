import { createModel } from '@rematch/core';
import type { RootModel } from './models';
import { cloud } from 'remax/wechat';

const COLLECTION_NAME = 'settings';

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
      const db = cloud.database();
      const { data } = await db.collection(COLLECTION_NAME).limit(1).get();
      console.log(data[0]);
      dispatch.settings.settings(data[0]);
    }
  })
});
