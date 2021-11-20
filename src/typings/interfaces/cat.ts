import { DbCat } from '../db';

export type UpdateCatRequest = Pick<DbCat, '_id' | 'status'>;
export interface UpdateCatResult {
  _id: string;
}

export interface ApiCat extends Omit<DbCat, 'relatedCats'> {
  relatedCats: DbCat[];
}
