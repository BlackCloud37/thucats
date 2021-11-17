import { DbCat } from '../db';

export interface CatSomeResult {
  value?: null;
}

export interface ApiCat extends Omit<DbCat, 'relatedCats'> {
  relatedCats: DbCat[];
}
