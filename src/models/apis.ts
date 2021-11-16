import { ActionFor, EController, Response } from '@/cloudfunctions/cloud/typings';
import { cloud, showToast } from 'remax/wechat';

export async function callApi(promise: Promise<any>): Promise<any> {
  const {
    data,
    status,
    statusText
  }: {
    data: any;
    status: number;
    statusText: string;
  } = await promise;
  if (status === 500 || status === 403) {
    showToast({
      title: '请求错误',
      icon: 'error'
    });
    console.error('callApi', status, statusText);
    return Promise.reject(Error(statusText));
  } else {
    console.log('callApi', data, status, statusText);
    return Promise.resolve(data);
  }
}

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
    return Promise.reject(e);
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
