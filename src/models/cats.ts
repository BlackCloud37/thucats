import { createModel } from '@rematch/core';
import { callApi, requestCloudApi } from './apis';
import type { RootModel } from './models';
import wxRequest from 'wechat-request';
import {
  ApiCat,
  ECatAcions,
  EController,
  UpdateCatRequest,
  UpdateCatResult
} from '@/typings/interfaces';
import { History } from '@/typings/db/history';
import sortBy from 'lodash.sortby';
import values from 'lodash.values';

export interface CatState {
  allCats: {
    [key: string]: ApiCat;
  };
  allCatsList: ApiCat[];
}

const initialState: CatState = {
  allCats: {},
  allCatsList: []
};

export const cats = createModel<RootModel>()({
  state: initialState,
  reducers: {
    allCats(state, payload: ApiCat[]) {
      const id2cats: { [key: string]: ApiCat } = {};
      payload.forEach((cat) => {
        id2cats[cat._id] = cat;
      });
      const noticeOrder = {
        高: 3,
        中: 2,
        低: 1,
        内部: 0
      };
      return {
        ...state,
        allCats: id2cats,
        allCatsList: sortBy(
          values(id2cats),
          (c) => (c.noticeLevel ? noticeOrder[c.noticeLevel] : -1),
          'name'
        ).reverse()
      };
    }
  },
  effects: (dispatch) => ({
    async fetchAllCatsAsync() {
      const { data } = await callApi(wxRequest.get('/cats'));
      dispatch.cats.allCats(data);
    },

    async updateCatAsync(payload: UpdateCatRequest, state) {
      requestCloudApi(EController.Cat, ECatAcions.Update, payload)
        .then((res: UpdateCatResult) => {
          console.log(res);
          const { _id } = res;
          const newCat = {
            ...state.cats.allCats[_id],
            ...payload
          };
          const newAllCatsList: ApiCat[] = [
            ...state.cats.allCatsList.filter((c) => c._id !== _id),
            newCat
          ];
          dispatch.cats.allCats(newAllCatsList);
        })
        .catch(console.error);
    },

    async addHistoryToCat(payload: { catId: string; newHistory: History }, state) {
      const { catId, newHistory } = payload;
      const cat = state.cats.allCats[catId];
      if (!cat) {
        return Promise.reject(Error('没有相关猫咪'));
      }

      const oldHistory = cat?.history ?? [];
      // TODO: check
      await dispatch.cats.updateCatAsync({
        _id: catId,
        history: [...oldHistory, newHistory]
      });
    }
  })
});

export const catLastHistory = (cat: ApiCat) => {
  const [last] = cat.history?.slice(-1) ?? [];
  return last;
};
