export type Controller = 'user';

export type Action = 'openid';

export interface CloudFunctionEvent {
  controller: Controller;
  action: Action;
  data: any;
}

export interface BaseResponse<T> {
  code: 0 | -1;
  data?: T;
  errMsg?: string;
  errCode?: number;
}

export interface UserOpenidResponse {
  openid: string;
}
