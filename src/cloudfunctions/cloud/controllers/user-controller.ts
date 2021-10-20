import BaseController from './base-controller';
import { BaseResponse, UserOpenidResponse } from '../typings';
import { CloudFnGlobal } from '../index';
declare let global: CloudFnGlobal;

export default class UserController extends BaseController {
  public async openid(_data: {}): Promise<BaseResponse<UserOpenidResponse>> {
    const wxContext = global.cloud.getWXContext();
    const openid = wxContext.OPENID;
    return this.success({
      openid
    });
  }
}
