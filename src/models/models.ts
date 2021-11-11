// @filename: models.ts
import { Models } from '@rematch/core';
import { cats } from './cats';
import { settings } from './settings';
import { users } from './users';

export interface RootModel extends Models<RootModel> {
  users: typeof users;
  cats: typeof cats;
  settings: typeof settings;
}

export const models: RootModel = { users, cats, settings };
