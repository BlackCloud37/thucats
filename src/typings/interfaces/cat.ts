import { DbCat } from '../db';

export const enum ECatAcions {
  // 更新猫信息
  Update = 'update'
}

export type UpdateCatRequest = Partial<Pick<DbCat, 'status' | 'history'>> & {
  _id: NonNullable<string>;
};

export interface UpdateCatResult {
  _id: string;
}

export interface ApiCat extends Omit<DbCat, 'relatedCats'> {
  relatedCats: DbCat[];
}
