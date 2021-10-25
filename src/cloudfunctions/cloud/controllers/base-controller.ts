import { ErrResponse, OkResponse } from '../typings';

export default class BaseController {
  /**
   * 调用成功
   */
  public success<T>(data: T): OkResponse<T> {
    return { code: 0, data };
  }

  /**
   * 调用失败
   */
  public fail(errCode = 0, errMsg = ''): ErrResponse {
    return { errCode, errMsg, code: -1 };
  }
}
