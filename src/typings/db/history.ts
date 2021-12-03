export interface History {
  historyType: '寄养' | '救助';
  owner: string; // 负责人姓名
  startDate: string; // 开始日期
  priority: '低' | '中' | '高'; // 优先级

  isDone?: boolean;
  contact?: string; // 寄养：寄养联系人；救助：医院联系人
  location?: string; // 寄养：寄养人地址；救助：医院地址
  detail?: string; // 详情

  // 救助
  hospitalName?: string;
  dueRemainDays?: number;

  // 寄养
  postPosted?: boolean;
  postImageURL?: string;
}
