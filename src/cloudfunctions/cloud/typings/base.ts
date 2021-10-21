import { ActionFor, EController } from './controllers';

export interface CloudFunctionEvent<C extends EController> {
  controller: C;
  action: ActionFor<C>;
  data: any;
}

export interface OkResponse<T> {
  code: 0;
  data: T;
}

export interface ErrResponse {
  code: -1;
  errMsg: string;
  errCode: number;
}

export type Response<T> = OkResponse<T> | ErrResponse;

export type IController<C extends EController> = {
  [key in ActionFor<C>]: any;
};
