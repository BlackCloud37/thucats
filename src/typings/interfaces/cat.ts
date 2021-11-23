import { DbCat } from '../db';

export type UpdateCatRequest = Partial<Pick<DbCat, 'status' | 'history'>> & {
  _id: NonNullable<string>;
};

export interface UpdateCatResult {
  _id: string;
}

export interface ApiCat extends Omit<DbCat, 'relatedCats'> {
  relatedCats: DbCat[];
}
