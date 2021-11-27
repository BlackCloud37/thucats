export interface History {
  historyType: '寄养' | '救助';
  owner: string; // 负责人姓名
  startDate: number; // 开始日期
  priority: 1 | 2 | 3 | 4 | 5; // 优先级

  isDone?: boolean;
  endDate?: number; // 结束日期
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
