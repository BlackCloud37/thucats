import { ActionFor, EController, Response } from '@/cloudfunctions/cloud/typings';
import { cloud } from 'remax/wechat';

// const getBaseUrl = () => {
//   let baseUrl = process.env.REMAX_APP_BASE_URL;
//   if (!baseUrl?.startsWith('https://')) {
//     baseUrl = `https://${baseUrl}`;
//   }
//   if (baseUrl.endsWith('/')) {
//     baseUrl = baseUrl.slice(0, baseUrl.length - 1);
//   }
//   return baseUrl;
// };

// const baseUrl = getBaseUrl();

// const codeMessage: { [key: number]: string } = {
//   200: '服务器成功返回请求的数据。',
//   201: '服务器成功返回请求的数据。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '您还没有登录，或登录身份过期，请登录后再操作！',
//   403: '您没有权限访问此资源或进行此操作！',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   405: '请求方法不被允许。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。'
// };

// interface IntegrationRes {
//   statusCode: number;
//   headers: Record<string, string>;
//   body: string;
//   isBase64Encoded: true | false;
// }

// function parseIntegrationRes(result: IntegrationRes) {
//   // 转化响应值
//   let body;
//   try {
//     body =
//       typeof result.body === 'string' && result.body?.length
//         ? JSON.parse(result.body)
//         : result.body;
//   } catch (error) {
//     console.log(error);
//     body = result.body;
//   }

//   if (body?.error) {
//     const errorText = codeMessage[result?.statusCode || 500];
//     throw new Error(errorText);
//   }

//   return body;
// }

// /**
//  * 兼容本地开发与云函数请求
//  */
// export async function tcbRequest<T = any>(
//   url: string,
//   options: { method?: 'GET' | 'POST'; params?: any; data?: any } = {}
// ): Promise<T> {
//   const { method, params, data } = options;
//   const functionName = 'tcb-ext-cms-service';

//   const res = await cloud.callFunction({
//     parse: true,
//     name: functionName,
//     data: {
//       body: data,
//       httpMethod: method,
//       queryStringParameters: params,
//       path: `/api/v1.0${url}`
//     }
//   });

//   if (res.result?.statusCode === 500) {
//     return Promise.reject(Error('请求错误'));
//   }

//   return parseIntegrationRes(res.result);
// }

// 通过EController, EAcion和Request请求云函数
export async function requestCloudApi<C extends EController>(
  controller: C,
  action: ActionFor<C>,
  payload: any = {}
) {
  try {
    console.log(`Calling: ${controller}.${action} with ${JSON.stringify(payload)}`);
    const response = await cloud.callFunction({
      name: 'cloud',
      data: { controller, action, data: payload }
    });
    if (!response || !response.result) {
      throw Error(response.msg);
    }

    const result: Response<any> = response.result; // unwrap wx cloud resp
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

export type Collections = 'users' | 'cats';
// 从集合中获取所有数据
export async function fetchAllFromCollection(collection: Collections, localUpdateTime = 0) {
  const db = cloud.database();
  const _ = db.command;
  const MAX_LIMIT = 20;

  const countResult = await db
    .collection(collection)
    .where({
      _updateTime: _.gt(localUpdateTime)
    })
    .count();
  const total = countResult.total;
  console.log(`fetch all from collection: totoal ${total}`);
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    let limit = i === batchTimes - 1 ? total % MAX_LIMIT : MAX_LIMIT;
    tasks.push(
      db
        .collection(collection)
        .where({
          _updateTime: _.gt(localUpdateTime)
        })
        .skip(i * MAX_LIMIT)
        .limit(limit)
        .get()
    );
  }
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg
    };
  });
}

// 获取集合最大的UpdatedTime
export async function fetchUpdatedTime(collection: Collections) {
  const db = cloud.database();
  try {
    const { data } = await db.collection(collection).limit(1).orderBy('_updateTime', 'desc').get();
    console.log(`updated time of collection ${collection} is ${data?.[0]._updateTime ?? 0}`);
    return data?.[0]?._updateTime ?? 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

export async function fetchCount(collection: Collections) {
  const db = cloud.database();
  try {
    const countResult = await db.collection(collection).count();
    return countResult.total ?? 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}
