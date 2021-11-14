import { createModel } from '@rematch/core';
import { callApi } from './apis';
// import { requestCloudApi } from './apis';
import type { JsonDbObject, RootModel } from './models';
import { default as _l } from 'lodash';
import wxRequest from 'wechat-request';

type FileID = string;

export interface Cat extends JsonDbObject {
  _avatar?: FileID; // 头像
  _photos?: FileID[]; // 其他照片

  // 用户字段，展示
  name: string; // 名字
  nickname?: string; // 昵称, 可选
  colorCategory: '纯黑' | '纯白' | '狸花' | '奶牛' | '橘猫与橘白' | '三花' | '玳瑁'; // 毛色分类
  colorDescription?: string; // 毛色描述, 可选
  sex: '公' | '母' | '未知'; // 性别
  status: '在野' | '已送养' | '喵星' | '未知' | '待领养'; // 状态
  neuteringStatus: '未绝育' | '已绝育' | '未知'; // 绝育状态
  neuteringDate?: string; // 绝育大致时间, 可选
  nameOrigin?: string; // 名字来源, 可选
  character?: string; // 性格, 可选
  location?: string; // 出没地点, 可选
  notes?: string; // 其他备注, 可选
  relatedCats?: Cat[]; // 相关猫咪，存的是猫咪ID
  relatedCatsDescription?: string; // 相关猫咪描述
  noticeLevel?: '高' | '中' | '低' | '内部';
  noticeAbstract?: string;
  noticeDescription?: string; // 公告
  healthStatus?: '健康' | '患病' | '未知'; // 健康状况
  healthDescription?: string; // 健康状况描述
  adoptContact?: string; // 领养联系人
  adoptDescription?: string; // 领养简介
  age?: string;
  birthday?: string;
}

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
