'use strict';

class BaseController {
    /**
     * 调用成功
     */
    success(data) {
        return { code: 0, data };
    }
    /**
     * 调用失败
     */
    fail(errCode = 0, errMsg = '') {
        return { errCode, errMsg, code: -1 };
    }
}

var EController;
(function (EController) {
    // Modify: add new controller
    EController["User"] = "user";
    EController["Cat"] = "cat";
})(EController || (EController = {}));
// Modify: add new EActions
var EUserActions;
(function (EUserActions) {
    EUserActions["GetOpenid"] = "getOpenid";
})(EUserActions || (EUserActions = {}));
var ECatAcions;
(function (ECatAcions) {
    ECatAcions["SomeMethod"] = "somemethod";
})(ECatAcions || (ECatAcions = {}));

// declare let global: CloudFnGlobal;
class CatController extends BaseController {
    async [ECatAcions.SomeMethod]() {
        return this.fail(404, 'Boomed');
    }
}

class UserController extends BaseController {
    async [EUserActions.GetOpenid]() {
        const wxContext = cloud.getWXContext();
        const openid = wxContext.OPENID;
        // const resp: UserOpenidResult = {};
        return this.success({
            openid
        });
    }
}

// ref: https://developers.weixin.qq.com/community/develop/article/doc/00086cf4f64ab01caf5ab708756813
// @ts-ignore
global.cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
// @ts-ignore
global.db = cloud.database();
// @ts-ignore
global._ = db.command;
// @ts-ignore
global.$ = _.aggregate;
// Modify: map controller to controller class
const dispatcher = {
    [EController.User]: new UserController(),
    [EController.Cat]: new CatController()
};
exports.main = async (event, context) => {
    console.log(event);
    console.log(context);
    const { controller, action, data } = event;
    try {
        // @ts-ignore
        let result = await dispatcher[controller][action](data);
        return result;
    }
    catch (e) {
        console.error(e);
        if (e instanceof TypeError) {
            return {
                code: -1,
                errCode: 404,
                errMsg: `Controller(${controller}) or Action(${action}) not found`
            };
        }
        else {
            return {
                code: -1,
                errCode: 500,
                errMsg: 'Internal error'
            };
        }
    }
};