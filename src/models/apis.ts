import { Action, BaseResponse, Controller } from '@/cloudfunctions/cloud/typings';
import { cloud } from 'remax/wechat';

export async function requestCloudApi(controller: Controller, action: Action, payload: any = {}) {
  try {
    console.log(`Calling: ${controller}.${action} with ${JSON.stringify(payload)}`);
    const response = await cloud.callFunction({
      name: 'cloud',
      data: { controller, action, data: payload }
    });
    if (!response || !response.result) {
      throw Error(response.msg);
    }

    const result: BaseResponse<any> = response.result; // unwrap wx cloud resp
    const { code } = result;
    if (code === 0) {
      // success
      const { data } = result;
      console.log(`Request success with data ${JSON.stringify(data)}`);
      return Promise.resolve(data);
    } else {
      // failed
      const { errCode, errMsg } = result;
      console.error(`Requset error with code ${errCode} and msg ${errMsg}`);
      return Promise.reject(errMsg);
    }
  } catch (e) {
    console.error(e);
    Promise.reject(e);
  }
}
