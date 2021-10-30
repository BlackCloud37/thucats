import { createModel } from '@rematch/core';
import { fetchAllFromCollection, fetchCount, fetchUpdatedTime } from './apis';
// import { requestCloudApi } from './apis';
import type { RootModel } from './models';
import { default as _l } from 'lodash';

const COLLECTION_NAME = 'cats';

type FileID = string;

export interface Cat {
  // _前缀的字段默认隐藏
  // 系统字段
  _id: string; // 唯一ID
  _createTime: number;
  _updateTime: number;

  // 用户字段，隐藏或不直接展示
  _avatar?: FileID; // 头像
  _photos?: FileID[]; // 其他照片

  // 用户字段，展示
  name: string; // 名字
  nickname?: string; // 昵称, 可选
  colorCategory: '纯黑' | '纯白' | '狸花' | '奶牛' | '橘猫与橘白' | '三花' | '玳瑁'; // 毛色分类
  colorDescription?: string; // 毛色描述, 可选
  sex: '公' | '母' | '未知'; // 性别
  status: '在野' | '已送养' | '喵星' | '失踪'; // 状态
  neuteringStatus: '未绝育' | '已绝育' | '未知'; // 绝育状态
  neuteringDate?: string; // 绝育大致时间, 可选
  nameOrigin?: string; // 名字来源, 可选
  character?: string; // 性格, 可选
  location?: string; // 出没地点, 可选
  notes?: string; // 其他备注, 可选
  relatedCats?: string[]; // 相关猫咪，存的是猫咪ID
  relatedCatsDescription?: string; // 相关猫咪描述
}

export interface CatState {
  allCats: {
    [key: string]: Cat;
  };
}

const initialState: CatState = {
  allCats: {}
};

export const cats = createModel<RootModel>()({
  state: initialState,
  reducers: {
    allCats(state, payload: Cat[]) {
      const id2cats: { [key: string]: Cat } = {};
      payload.forEach((cat) => {
        id2cats[cat._id] = cat;
      });
      return {
        ...state,
        allCats: id2cats
      };
    }
  },
  effects: (dispatch) => ({
    async fetchAllCatsAsync(_, state) {
      // TODO: BUG: 无法同步被删除的猫咪
      console.log('fetchAllCatsAsync');
      const { allCats } = state.cats;
      const updatedTime = _l.maxBy(_l.values(allCats), (cat) => cat._updateTime)?._updateTime ?? 0;

      console.log(`local updated time of cat is ${updatedTime}`);
      let needFetch = false;
      if (updatedTime <= 0 || _l.isEmpty(allCats)) {
        // 无数据，直接拉
        console.log('theres no data, need fetch');
        needFetch = true;
      } else {
        // 比较数据库最后一条的updated
        const serverUpdatedTime = await fetchUpdatedTime(COLLECTION_NAME);
        if (updatedTime !== serverUpdatedTime) {
          needFetch = true;
        } else {
          const count = await fetchCount(COLLECTION_NAME);
          console.log(`server count is ${count} local count is ${_l.size(allCats)}`);
          if (count !== _l.size(allCats)) {
            needFetch = true;
          }
        }
      }
      if (needFetch) {
        console.log('Fecth all cats start-----------------------------');
        const { data } = await fetchAllFromCollection(COLLECTION_NAME);
        console.log(`${_l.size(data)} new cats fetched`);
        dispatch.cats.allCats(data);
      }
    }
  })
});
