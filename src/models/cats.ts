import { createModel } from '@rematch/core';
import { fetchAllFromCollection } from './apis';
// import { requestCloudApi } from './apis';
import type { RootModel } from './models';

const COLLECTION_NAME = 'cats';
// _前缀的字段默认隐藏

type FileID = string;

export interface Cat {
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
  allCats: Map<string, Cat>;
}

const initialState: CatState = {
  allCats: new Map()
};

export const cats = createModel<RootModel>()({
  state: initialState,
  reducers: {
    allCats(state, payload: Cat[]) {
      const id2cats = new Map(payload.map((cat: Cat) => [cat._id, cat]));
      return {
        ...state,
        allCats: id2cats
      };
    }
  },
  effects: (dispatch) => ({
    async fetchAllCatsAsync() {
      console.log('Fecth all cats start.');
      const res = await fetchAllFromCollection(COLLECTION_NAME);
      console.log(res);
      dispatch.cats.allCats(res.data);
    }
  })
});
