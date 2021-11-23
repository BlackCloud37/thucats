import { JsonDbObject } from '.';

export interface DbHistory extends JsonDbObject {
  historyType: '寄养' | '救助';
  owner?: string; // name
  startDate?: number;
  priority?: number;
  detail?: string;
  done?: boolean;
  contact?: string;
  location?: string;

  // 救助
  hospitalName?: string;
  dueRemainDays?: number;

  // 寄养
  postPosted?: boolean;
  postImageURL?: string;
}
