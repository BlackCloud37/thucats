import { cloud } from 'remax/wechat';

interface CommonCloudApiResponse {
  result: {
    err_msg?: String;
    // [key: String]: any;
  };
}

export async function requestCloudApi(command: String, payload: any = {}) {
  try {
    console.log(`Calling: ${command} with ${JSON.stringify(payload)}`);
    const response: CommonCloudApiResponse = await cloud.callFunction({
      name: command,
      data: payload
    });
    const { result } = response;
    console.log('Request result: ', result);

    if (result.err_msg) {
      return Promise.reject(result.err_msg);
    } else {
      return result;
    }
  } catch (e) {
    console.error(e);
    Promise.reject(e);
  }
}
