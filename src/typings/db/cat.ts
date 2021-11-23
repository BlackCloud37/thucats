import { JsonDbObject, FileID } from '.';
import { DbHistory } from './history';

// export type CatStatus = '在野' | '已送养' | '喵星' | '未知' | '待领养';
export const CAT_STATUS_ENUM = ['在野', '已送养', '喵星', '未知', '待领养'] as const;
export type CatStatus = typeof CAT_STATUS_ENUM[number];

export interface DbCat extends JsonDbObject {
  _avatar?: FileID; // 头像
  _photos?: FileID[]; // 其他照片

  // 用户字段，展示
  name: string; // 名字
  nickname?: string; // 昵称, 可选
  colorCategory: '纯黑' | '纯白' | '狸花' | '奶牛' | '橘猫与橘白' | '三花' | '玳瑁'; // 毛色分类
  colorDescription?: string; // 毛色描述, 可选
  sex: '公' | '母' | '未知'; // 性别
  status: CatStatus; // 状态
  neuteringStatus: '未绝育' | '已绝育' | '未知'; // 绝育状态
  neuteringDate?: string; // 绝育大致时间, 可选
  nameOrigin?: string; // 名字来源, 可选
  character?: string; // 性格, 可选
  location?: string; // 出没地点, 可选
  notes?: string; // 其他备注, 可选
  relatedCats?: string[]; // 相关猫咪的ID
  relatedCatsDescription?: string[]; // 相关猫咪描述
  noticeLevel?: '高' | '中' | '低' | '内部';
  noticeAbstract?: string;
  noticeDescription?: string; // 公告
  healthStatus?: '健康' | '患病' | '未知'; // 健康状况
  healthDescription?: string; // 健康状况描述
  adoptContact?: string; // 领养联系人
  adoptDescription?: string; // 领养简介
  age?: string;
  birthday?: string;
  history?: DbHistory[];
}
