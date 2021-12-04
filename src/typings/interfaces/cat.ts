import { DbCat } from '../db';

export const enum ECatAcions {
  // 更新猫信息
  Update = 'update'
}
export const CAT_ALLOWED_EDIT_FIELDS = [
  'status',
  'history',
  'adoptContact',
  'adoptDescription'
] as const;
type AllowedFields = typeof CAT_ALLOWED_EDIT_FIELDS[number];
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
