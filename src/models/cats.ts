import { createModel } from '@rematch/core';
import { callApi } from './apis';
// import { requestCloudApi } from './apis';
import type { RootModel } from './models';
import { default as _l } from 'lodash';
import wxRequest from 'wechat-request';
import { Cat } from '@/cloudfunctions/cloud/controllers/cat/db';

export interface CatState {
  allCats: {
    [key: string]: Cat;
  };
  allCatsList: Cat[];
}

const initialState: CatState = {
  allCats: {},
  allCatsList: []
};

export const cats = createModel<RootModel>()({
  state: initialState,
  reducers: {
    allCats(state, payload: Cat[]) {
      const id2cats: { [key: string]: Cat } = {};
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
        allCatsList: _l
          .sortBy(
            _l.values(id2cats),
            (c) => (c.noticeLevel ? noticeOrder[c.noticeLevel] : -1),
            'name'
          )
          .reverse()
      };
    }
  },
  effects: (dispatch) => ({
    async fetchAllCatsAsync() {
      const { data } = await callApi(wxRequest.get('/cats'));
      dispatch.cats.allCats(data);
      // // TODO: BUG: 无法同步被删除的猫咪
      // console.log('fetchAllCatsAsync');
      // const { allCatsList } = state.cats;
      // const updatedTime = _l.maxBy(allCatsList, (cat) => cat._updateTime)?._updateTime ?? 0;

      // console.log(`local updated time of cat is ${updatedTime}`);
      // let needFetch = false;
      // if (updatedTime <= 0 || _l.isEmpty(allCatsList)) {
      //   // 无数据，直接拉
      //   console.log('theres no data, need fetch');
      //   needFetch = true;
      // } else {
      //   // 比较数据库最后一条的updated
      //   const serverUpdatedTime = await fetchUpdatedTime(COLLECTION_NAME);
      //   if (updatedTime !== serverUpdatedTime) {
      //     needFetch = true;
      //   } else {
      //     const count = await fetchCount(COLLECTION_NAME);
      //     console.log(`server count is ${count} local count is ${_l.size(allCatsList)}`);
      //     if (count !== _l.size(allCatsList)) {
      //       needFetch = true;
      //     }
      //   }
      // }
      // if (needFetch) {
      //   console.log('Fecth all cats start-----------------------------');
      //   const { data } = await fetchAllFromCollection(COLLECTION_NAME);
      //   console.log(`${_l.size(data)} new cats fetched`);
      //   dispatch.cats.allCats(data);
      // }
    }
  })
});
