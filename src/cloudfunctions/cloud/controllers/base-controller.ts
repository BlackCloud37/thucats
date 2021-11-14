import { ErrResponse, OkResponse } from '../typings';

export default class BaseController {
  /**
   * 调用成功
   */
  public success<T>(data: T): OkResponse<T> {
    console.log('success with data', data);
    return { code: 0, data };
  }

  /**
   * 调用失败
   */
  public fail(errCode = 0, errMsg = ''): ErrResponse {
    console.log('fail with errorcode ', errCode, ' and msg ', errMsg);
    return { errCode, errMsg, code: -1 };
  }
}
