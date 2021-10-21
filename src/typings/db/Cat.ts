export interface Cat {
  _id: string; // 唯一ID
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
}
