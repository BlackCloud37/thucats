'use strict';

class BaseController {
    /**
     * 调用成功
     */
    success(data) {
        console.log('success with data', data);
        return { code: 0, data };
    }
    /**
     * 调用失败
     */
    fail(errCode = 0, errMsg = '') {
        console.log('fail with errorcode ', errCode, ' and msg ', errMsg);
        return { errCode, errMsg, code: -1 };
    }
}

var EController;
(function (EController) {
    // Modify: add new controller
    EController["User"] = "user";
    EController["Cat"] = "cat";
    EController["Application"] = "request"; // Request和请求有歧义，重命名一下
})(EController || (EController = {}));
// Modify: add new EActions
var EUserActions;
(function (EUserActions) {
    EUserActions["Login"] = "login";
})(EUserActions || (EUserActions = {}));
var ECatAcions;
(function (ECatAcions) {
    ECatAcions["SomeMethod"] = "somemethod";
})(ECatAcions || (ECatAcions = {}));
var EApplicationActions;
(function (EApplicationActions) {
    // 同意、取消申请
    EApplicationActions["Update"] = "update";
})(EApplicationActions || (EApplicationActions = {}));

class CatController extends BaseController {
    async [ECatAcions.SomeMethod]() {
        return this.fail(404, 'Boomed');
    }
}

const roles2RoleSet = (roles) => {
    if (roles.length === 0) {
        return new Set();
    }
    const roleSet = new Set(roles);
    if (roleSet.has('admin')) {
        roleSet.add('operator');
    }
    return roleSet;
};
async function update(collectionName, _id, newRecord) {
    const timestamp = Date.now();
    console.log('update', arguments);
    console.log('updatetime', timestamp);
    const newRecordWithTime = {
        ...newRecord,
        _updateTime: timestamp
    };
    // @ts-ignore
    delete newRecordWithTime._id;
    await db.collection(collectionName).doc(_id).update({
        data: newRecordWithTime
    });
    return { ...newRecordWithTime, _id };
}
async function add(collectionName, newRecord) {
    console.log('add', arguments);
    const timestamp = Date.now();
    const newRecordWithTime = {
        ...newRecord,
        _createTime: timestamp,
        _updateTime: timestamp
    };
    const { _id } = await db.collection(collectionName).add({
        data: newRecordWithTime
    });
    return _id;
}
async function getById(collectionName, _id) {
    console.log('getById', arguments);
    const { data } = await db.collection(collectionName).doc(_id).get();
    console.log('getById result', data);
    return data;
}
function checkPermission(requiredRole, roles) {
    console.log('checkpermission', 'roles', roles);
    if (!roles) {
        return false;
    }
    const roleSet = roles2RoleSet(roles);
    if (roleSet.has(requiredRole)) {
        return true;
    }
    return false;
}

// import { User } from '@/models/users';
const COLLECTION_NAME$1 = 'users';
async function getCurrentUser() {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    return getUserByOpenid(openid);
}
async function updateUser(_id, newRecord) {
    return update(COLLECTION_NAME$1, _id, newRecord);
}
async function addUser(newRecord) {
    return add(COLLECTION_NAME$1, newRecord);
}
async function getUserByOpenid(openid) {
    const { data: [user] } = await db
        .collection('users')
        .where({
        openid
    })
        .get();
    console.log('get user by openid', user);
    return user;
}
async function getUserById(_id) {
    return getById(COLLECTION_NAME$1, _id);
}

class UserController extends BaseController {
    async [EUserActions.Login]({ avatarUrl, nickName }) {
        const wxContext = cloud.getWXContext();
        const openid = wxContext.OPENID;
        const record = await getCurrentUser();
        console.log('record', record);
        if (record) {
            const newRecord = {
                ...record,
                avatarUrl: avatarUrl ? avatarUrl : record.avatarUrl,
                nickName: nickName ? nickName : record.nickName
            };
            return this.success(await updateUser(record._id, newRecord));
        }
        else {
            if (!nickName || !avatarUrl) {
                return this.fail(500, '必须提供用户信息');
            }
            // 如果数据库里没有，则新建
            const newRecord = {
                nickName,
                avatarUrl,
                openid,
                roles: []
            };
            await addUser(newRecord);
            return this.success(await getCurrentUser());
        }
    }
}

const COLLECTION_NAME = 'requests';
async function updateRequest(_id, newRecord) {
    return update(COLLECTION_NAME, _id, newRecord);
}
async function getRequestById(_id) {
    return getById(COLLECTION_NAME, _id);
}

class ApplicationController extends BaseController {
    async [EApplicationActions.Update]({ requestId, action }) {
        const user = await getCurrentUser();
        if (!user) {
            return this.fail(500, 'No such user');
        }
        const record = await getRequestById(requestId);
        if (record.status !== 'pending') {
            return this.fail(500, 'Can only update pending request');
        }
        const requiredRole = record.requestType === 'imageUpload' ? 'operator' : 'admin';
        if (!checkPermission(requiredRole, user.roles)) {
            return this.fail(403, `No permission required role ${requiredRole}`);
        }
        // WARNING: no transaction here
        if (action === 'approve') {
            switch (record.requestType) {
                case 'permission': {
                    const applicantId = record.applicant;
                    const applicant = await getUserById(applicantId);
                    console.log('applicant', applicant);
                    const roleSet = new Set([...applicant.roles, 'operator']); // 默认增加operator权限
                    const newUser = {
                        ...applicant,
                        roles: Array.from(roleSet)
                    };
                    await updateUser(applicantId, newUser);
                    break;
                }
            }
        }
        const newRecord = {
            ...record,
            status: action === 'approve' ? 'approved' : 'denied'
        };
        await updateRequest(requestId, newRecord);
        return this.success({ _id: requestId });
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
    [EController.Cat]: new CatController(),
    [EController.Application]: new ApplicationController()
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
