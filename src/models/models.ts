// @filename: models.ts
import { Models } from '@rematch/core';
import { cats } from './cats';
import { users } from './users';

export interface RootModel extends Models<RootModel> {
  users: typeof users;
  cats: typeof cats;
}

export const models: RootModel = { users, cats };
