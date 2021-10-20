export interface CloudFnGlobal {
  cloud: any;
  db: any;
  _: any;
  $: any;
}

declare let global: CloudFnGlobal;

// ref: https://developers.weixin.qq.com/community/develop/article/doc/00086cf4f64ab01caf5ab708756813
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

global.cloud = cloud;
global.db = cloud.database();
global._ = global.db.command;
global.$ = global._.aggregate;

import UserController from './controllers/user-controller';
import { CloudFunctionEvent } from './typings';

const dispatch = {
  user: new UserController()
};

exports.main = async (event: CloudFunctionEvent, context: any) => {
  console.log(event);
  console.log(context);
  const { controller, action, data } = event;
  let result = await dispatch[controller][action](data);
  return result;
};
