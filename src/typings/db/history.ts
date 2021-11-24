export interface History {
  historyType: '寄养' | '救助';
  owner?: string; // name
  startDate?: number;
  endDate?: number;
  isDone?: boolean;

  priority?: number;
  detail?: string;
  contact?: string;
  location?: string;

  // 救助
  hospitalName?: string;
  dueRemainDays?: number;

  // 寄养
  postPosted?: boolean;
  postImageURL?: string;
}
