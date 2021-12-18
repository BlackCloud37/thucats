import { DbCat } from '../db';
import { History } from '../db/history';

export const enum ECatAcions {
  // 更新猫信息
  Update = 'update',
  AddHistory = 'addHistory',
  FinishLastHistory = 'finishLastHistory'
}

export const CAT_ALLOWED_EDIT_FIELDS = ['status', 'adoptContact', 'adoptDescription'] as const;
type AllowedFields = typeof CAT_ALLOWED_EDIT_FIELDS[number];
export type UpdateCatRequest = Partial<Pick<DbCat, AllowedFields>> & {
  _id: NonNullable<string>;
  updatedFields: AllowedFields[];
};

export interface UpdateCatResult {
  _id: string;
}

export interface AddHistoryRequest {
  _id: NonNullable<string>;
  history: History;
}

export interface AddHistoryResult {
  _id: string;
  history: History[];
}

export interface FinishLastHistoryRequest {
  _id: NonNullable<string>;
}

export interface FinishLastHistoryResult {
  _id: string;
  history: History[];
}

export interface ApiCat extends Omit<DbCat, 'relatedCats'> {
  relatedCats: DbCat[];
}
