import BaseController from '../base-controller';
import {
  Response,
  IController,
  EUserActions,
  UserLoginResult,
  UserLoginRequest,
  EController
} from '@/typings/interfaces';
import { addUser, getCurrentUser, updateUser } from './db';

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
    const record = await getCurrentUser();

    console.log('record', record);
    if (record) {
      const newRecord = {
        ...record,
        avatarUrl: avatarUrl ? avatarUrl : record.avatarUrl,
        nickName: nickName ? nickName : record.nickName
      };

      return this.success(await updateUser(record._id!, newRecord));
    } else {
      if (!nickName || !avatarUrl) {
        return this.fail(500, '必须提供用户信息');
      }
      // 如果数据库里没有，则新建
      const newRecord = {
        nickName,
        avatarUrl,
        openid,
        roles: []
      };
      await addUser(newRecord);
      return this.success(await getCurrentUser());
    }
  }
}
