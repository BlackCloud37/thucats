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

import CatController from './controllers/cat-controller';
import UserController from './controllers/user-controller';
import { CloudFunctionEvent, EController, Response } from './typings';

// Modify: map controller to controller class
const dispatcher = {
  [EController.User]: new UserController(),
  [EController.Cat]: new CatController()
};

exports.main = async <C extends EController>(
  event: CloudFunctionEvent<C>,
  context: any
): Promise<Response<any>> => {
  console.log(event);
  console.log(context);
  const { controller, action, data } = event;
  try {
    // @ts-ignore
    let result = await dispatcher[controller][action](data);
    return result;
  } catch (e) {
    console.error(e);
    if (e instanceof TypeError) {
      return {
        code: -1,
        errCode: 404,
        errMsg: `Controller(${controller}) or Action(${action}) not found`
      };
    } else {
      return {
        code: -1,
        errCode: 500,
        errMsg: 'Internal error'
      };
    }
  }
};
