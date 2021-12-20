import { createModel } from '@rematch/core';
import { callApi, requestCloudApi } from './apis';
import type { RootModel } from './models';
import wxRequest from 'wechat-request';
import {
  AddHistoryRequest,
  AddHistoryResult,
  ApiCat,
  ECatAcions,
  EController,
  FinishLastHistoryRequest,
  FinishLastHistoryResult,
  UpdateCatRequest,
  UpdateCatResult
} from '@/typings/interfaces';
import sortBy from 'lodash.sortby';
import values from 'lodash.values';
import dayjs from 'dayjs';
export interface CatState {
  allCats: {
    [key: string]: ApiCat;
  };
  allCatsList: ApiCat[];
}

const noticeOrder = {
  高: 3,
  中: 2,
  低: 1,
  内部: 0
};

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

      return {
        ...state,
        allCats: id2cats,
        allCatsList: sortBy(
          values(id2cats),
          (c) => (c.noticeLevel ? noticeOrder[c.noticeLevel] : -1),
          'name'
        ).reverse()
      };
    },
    cat(state, payload: ApiCat) {
      const { _id } = payload;
      const newAllCatsList: ApiCat[] = [...state.allCatsList.filter((c) => c._id !== _id), payload];
      const id2cats: { [key: string]: ApiCat } = {};
      newAllCatsList.forEach((cat) => {
        id2cats[cat._id] = cat;
      });
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
      // TODO: check
      requestCloudApi(EController.Cat, ECatAcions.Update, payload)
        .then((res: UpdateCatResult) => {
          console.log(res);
          const { _id } = res;
          const newCat = {
            ...state.cats.allCats[_id],
            ...payload
          };

          dispatch.cats.cat(newCat);
        })
        .catch(console.error);
    },

    async addHistoryToCatAsync(payload: AddHistoryRequest, state) {
      const { _id, history } = payload;
      if (!_id || !history) {
        return Promise.reject(Error('参数不能为空'));
      }
      const cat = state.cats.allCats[_id];
      if (!cat) {
        return Promise.reject(Error('没有相关猫咪'));
      }

      requestCloudApi(EController.Cat, ECatAcions.AddHistory, payload)
        .then((res: AddHistoryResult) => {
          console.log(res);
          const { history } = res;
          dispatch.cats.cat({
            ...cat,
            history
          });
        })
        .catch(console.error);
    },

    async finishLastHistoryAsync(payload: FinishLastHistoryRequest, state) {
      const { _id } = payload;
      if (!_id) {
        return Promise.reject(Error('参数不能为空'));
      }
      const cat = state.cats.allCats[_id];
      if (!cat) {
        return Promise.reject(Error('没有相关猫咪'));
      }

      requestCloudApi(EController.Cat, ECatAcions.FinishLastHistory, payload)
        .then((res: FinishLastHistoryResult) => {
          console.log(res);
          const { history } = res;
          dispatch.cats.cat({
            ...cat,
            history
          });
        })
        .catch(console.error);
    },

    async pullCatByIdAsync(payload: string) {
      if (!payload) {
        return Promise.reject(Error('id不能为空'));
      }
      const { data } = await callApi(wxRequest.get(`/cats/${payload}`));
      console.log(data);
      dispatch.cats.cat(data);
    }
  })
});

export const catLastHistory = (cat: ApiCat | undefined) => {
  const [last] = cat?.history?.slice(-1) ?? [];
  return last;
};

const priority2num = {
  高: 2,
  中: 1,
  低: 0
};

export const sortCatByHistoryPriority = (cats: ApiCat[]) => {
  return sortBy(
    cats,
    (c) => {
      const lastHistory = catLastHistory(c);
      return lastHistory ? priority2num[lastHistory.priority] : -1;
    },
    (c) => {
      const lastHistory = catLastHistory(c);
      const { historyType, startDate } = lastHistory;
      const duraDays = Math.max(dayjs().diff(startDate, 'days'), 0);
      console.log(lastHistory, startDate, duraDays);
      if (historyType === '寄养') {
        return duraDays;
      } else if (historyType === '救助') {
        const { dueRemainDays = 0 } = lastHistory;
        const remianDays = Math.max(dueRemainDays - duraDays, 0);
        return -remianDays;
      }
    }
  ).reverse();
};
