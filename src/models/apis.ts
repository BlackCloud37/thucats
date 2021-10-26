import { ActionFor, EController, Response } from '@/cloudfunctions/cloud/typings';
import { cloud } from 'remax/wechat';

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

// const cloud = require('wx-server-sdk')
// cloud.init()
// const db = cloud.database()
// const MAX_LIMIT = 100
// exports.main = async (event, context) => {
//   // 先取出集合记录总数
//   const countResult = await db.collection('todos').count()
//   const total = countResult.total
//   // 计算需分几次取
//   const batchTimes = Math.ceil(total / 100)
//   // 承载所有读操作的 promise 的数组
//   const tasks = []
//   for (let i = 0; i < batchTimes; i++) {
//     const promise = db.collection('todos').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
//     tasks.push(promise)
//   }
//   // 等待所有
//   return (await Promise.all(tasks)).reduce((acc, cur) => {
//     return {
//       data: acc.data.concat(cur.data),
//       errMsg: acc.errMsg,
//     }
//   })
// }
export async function fetchAllFromCollection(collection: 'users' | 'cats') {
  const db = cloud.database();
  const MAX_LIMIT = 20;
  const countResult = await db.collection(collection).count();
  const total = countResult.total;
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    tasks.push(
      db
        .collection(collection)
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
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
