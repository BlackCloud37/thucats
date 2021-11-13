import BaseController from './base-controller';
import { Response, EController, IController, EUserActions, UserLoginResult } from '../typings';

const COLLECTION_NAME = 'users';

export default class UserController
  extends BaseController
  implements IController<EController.User>
{
  public async [EUserActions.Login](): Promise<Response<UserLoginResult>> {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;

    const {
      data: [record]
    } = await db
      .collection(COLLECTION_NAME)
      .where({
        openid
      })
      .get();

    if (record) {
      return this.success(record);
    } else {
      // 如果数据库里没有，则新建
      await db.collection(COLLECTION_NAME).add({
        data: {
          openid,
          role: 0
        }
      });
      return this.success({
        openid,
        role: 0
      });
    }
  }
}
