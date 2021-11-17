export interface JsonDbObject {
  // _前缀的字段默认隐藏
  // 系统字段
  _id: string; // 唯一ID
  _createTime?: number;
  _updateTime?: number;
}

export type FileID = string;

export * from './user';
export * from './cat';
export * from './request';
