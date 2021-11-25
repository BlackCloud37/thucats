import { EApplicationActions, ECatAcions, EUserActions } from '.';

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

export const enum EController {
  // Modify: add new controller
  User = 'user',
  Cat = 'cat',
  Application = 'request' // Request和请求有歧义，重命名一下
}

// prettier-ignore
// Modify: add Controller to Action
export type ActionFor<C extends EController> = 
  C extends EController.User ? EUserActions :
  C extends EController.Cat  ? ECatAcions:
  C extends EController.Application ? EApplicationActions:
  never;
