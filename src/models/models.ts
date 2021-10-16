// @filename: models.ts
import { Models } from '@rematch/core';
import { users } from './users';

export interface RootModel extends Models<RootModel> {
  users: typeof users;
}

export const models: RootModel = { users };
