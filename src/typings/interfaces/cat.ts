import { DbCat } from '../db';

export const enum ECatAcions {
  // 更新猫信息
  Update = 'update'
}

type AllowedFields = 'status' | 'history' | 'adoptContact' | 'adoptDescription';
export type UpdateCatRequest = Partial<Pick<DbCat, AllowedFields>> & {
  _id: NonNullable<string>;
  updatedFields: AllowedFields[];
};

export interface UpdateCatResult {
  _id: string;
}

export interface ApiCat extends Omit<DbCat, 'relatedCats'> {
  relatedCats: DbCat[];
}
