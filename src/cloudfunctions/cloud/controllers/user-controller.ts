import BaseController from './base-controller';
import { Response, EController, IController, UserOpenidResult, EUserActions } from '../typings';

export default class UserController
  extends BaseController
  implements IController<EController.User>
{
  public async [EUserActions.GetOpenid](): Promise<Response<UserOpenidResult>> {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    return this.success({
      openid
    });
  }
}
