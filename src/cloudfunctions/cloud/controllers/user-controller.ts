import BaseController from './base-controller';
import { Response, EController, IController, UserOpenidResult } from '../typings';
import { CloudFnGlobal } from '../index';
declare let global: CloudFnGlobal;

export default class UserController
  extends BaseController
  implements IController<EController.User>
{
  public async getOpenid(): Promise<Response<UserOpenidResult>> {
    const wxContext = global.cloud.getWXContext();
    const openid = wxContext.OPENID;
    return this.success({
      openid
    });
  }
}
