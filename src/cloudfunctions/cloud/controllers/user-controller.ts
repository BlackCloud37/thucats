import BaseController from './base-controller';
import {
  Response,
  EController,
  IController,
  EUserActions,
  UserLoginResult,
  UserLoginRequest
} from '../typings';

const COLLECTION_NAME = 'users';

export default class UserController
  extends BaseController
  implements IController<EController.User>
{
  public async [EUserActions.Login]({
    avatarUrl,
    nickName
  }: UserLoginRequest): Promise<Response<UserLoginResult>> {
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

    console.log('record', record);
    if (record) {
      const newRecord = {
        ...record,
        avatarUrl: avatarUrl ? avatarUrl : record.avatarUrl,
        nickName: nickName ? nickName : record.nickName
      };
      await db.collection(COLLECTION_NAME).doc(record._id).update({
        data: newRecord
      });
      return this.success(newRecord);
    } else {
      if (!nickName || !avatarUrl) {
        return this.fail(500, '必须提供用户信息');
      }
      // 如果数据库里没有，则新建
      const defaultRole: 0 | 100 | 999 = 0;
      const newRecord = {
        nickName,
        avatarUrl,
        openid,
        role: defaultRole
      };
      await db.collection(COLLECTION_NAME).add({
        data: newRecord
      });
      return this.success(newRecord);
    }
  }
}
