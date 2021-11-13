// @filename: models.ts
import { Models } from '@rematch/core';
import { cats } from './cats';
import { settings } from './settings';
import { users } from './users';

export interface JsonDbObject {
  // _前缀的字段默认隐藏
  // 系统字段
  _id: string; // 唯一ID
  _createTime: number;
  _updateTime: number;
}

export interface RootModel extends Models<RootModel> {
  users: typeof users;
  cats: typeof cats;
  settings: typeof settings;
}

export const models: RootModel = { users, cats, settings };
