'use strict';

var _l = require('lodash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _l__default = /*#__PURE__*/_interopDefaultLegacy(_l);

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

var ECatAcions;
(function (ECatAcions) {
    // 更新猫信息
    ECatAcions["Update"] = "update";
    ECatAcions["AddHistory"] = "addHistory";
    ECatAcions["FinishLastHistory"] = "finishLastHistory";
})(ECatAcions || (ECatAcions = {}));
const CAT_ALLOWED_EDIT_FIELDS = ['status', 'adoptContact', 'adoptDescription'];

var EUserActions;
(function (EUserActions) {
    EUserActions["Login"] = "login";
})(EUserActions || (EUserActions = {}));

var EApplicationActions;
(function (EApplicationActions) {
    // 同意、取消申请
    EApplicationActions["Update"] = "update";
})(EApplicationActions || (EApplicationActions = {}));

var EController;
(function (EController) {
    // Modify: add new controller
    EController["User"] = "user";
    EController["Cat"] = "cat";
    EController["Application"] = "request"; // Request和请求有歧义，重命名一下
})(EController || (EController = {}));

const REQUEST_COLLECTION_NAME = 'requests';
const USER_COLLECTION_NAME = 'users';
const CAT_COLLECTION_NAME = 'cats';

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
async function update(collectionName, newRecord, database) {
    const timestamp = Date.now();
    console.log('update', arguments);
    const { _id } = newRecord;
    if (!_id) {
        return Promise.reject(Error('newRecord must has `_id`'));
    }
    const _db = database ? database : db;
    const newRecordWithTime = {
        ...newRecord,
        _updateTime: timestamp
    };
    // @ts-ignore
    delete newRecordWithTime._id;
    await _db.collection(collectionName).doc(_id).update({
        data: newRecordWithTime
    });
    return { ...newRecordWithTime, _id };
}
async function add(collectionName, newRecord, database) {
    console.log('add', arguments);
    const _db = database ? database : db;
    const timestamp = Date.now();
    const newRecordWithTime = {
        ...newRecord,
        _createTime: timestamp,
        _updateTime: timestamp
    };
    const { _id } = await _db.collection(collectionName).add({
        data: newRecordWithTime
    });
    return _id;
}
async function getById(collectionName, _id, database) {
    console.log('getById', arguments);
    const _db = database ? database : db;
    const { data } = await _db.collection(collectionName).doc(_id).get();
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

async function getCurrentUser() {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    return getUserByOpenid(openid);
}
async function getUserByOpenid(openid) {
    const { data: [user] } = await db
        .collection(USER_COLLECTION_NAME)
        .where({
        openid
    })
        .get();
    console.log('get user by openid', user);
    return user;
}

class CatController extends BaseController {
    async [ECatAcions.Update](request) {
        const user = await getCurrentUser();
        if (!checkPermission('operator', user ? user.roles : [])) {
            return this.fail(403, '无修改权限');
        }
        const { _id, updatedFields } = request;
        const record = await getById(CAT_COLLECTION_NAME, _id);
        if (!record) {
            return this.fail(500, '不存在该记录');
        }
        const updated = _l__default["default"].pick(_l__default["default"].pick(request, updatedFields), CAT_ALLOWED_EDIT_FIELDS); // 只选择允许修改的且请求表明修改了的字段修改
        await update(CAT_COLLECTION_NAME, { ...record, ...updated });
        return this.success({ _id });
    }
    async [ECatAcions.AddHistory](requset) {
        const user = await getCurrentUser();
        if (!checkPermission('operator', user ? user.roles : [])) {
            return this.fail(403, '无修改权限');
        }
        const { _id, history } = requset;
        const record = await getById(CAT_COLLECTION_NAME, _id);
        if (!record) {
            return this.fail(500, '不存在该记录');
        }
        const lastHistory = _l__default["default"].last(record.history);
        if (lastHistory && !lastHistory.isDone) {
            return this.fail(500, '需要先完成最后一条记录');
        }
        await update(CAT_COLLECTION_NAME, {
            ...record,
            history: db.command.push(history)
        });
        const newRec = await getById(CAT_COLLECTION_NAME, _id);
        return this.success({ _id, history: newRec.history ? newRec.history : [] });
    }
    async [ECatAcions.FinishLastHistory](requset) {
        const user = await getCurrentUser();
        if (!checkPermission('operator', user ? user.roles : [])) {
            return this.fail(403, '无修改权限');
        }
        const { _id } = requset;
        const record = await getById(CAT_COLLECTION_NAME, _id);
        if (!record) {
            return this.fail(500, '不存在该记录');
        }
        const { history = [] } = record;
        const lastHistory = _l__default["default"].last(history);
        history.pop(); // remove last history
        if (!lastHistory) {
            return this.success({ _id, history: [] });
        }
        const newHistory = [
            ...history,
            {
                ...lastHistory,
                isDone: true
            }
        ];
        await update(CAT_COLLECTION_NAME, {
            ...record,
            history: newHistory
        });
        return this.success({ _id, history: newHistory });
    }
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
            return this.success(await update(USER_COLLECTION_NAME, newRecord));
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
            await add(USER_COLLECTION_NAME, newRecord);
            return this.success((await getCurrentUser()));
        }
    }
}

class ApplicationController extends BaseController {
    async [EApplicationActions.Update]({ requestId, action }) {
        const user = await getCurrentUser();
        if (!user) {
            return this.fail(500, 'No such user');
        }
        const record = await getById(REQUEST_COLLECTION_NAME, requestId);
        if (record.status !== 'pending') {
            return this.fail(500, 'Can only update pending request');
        }
        const requiredRole = record.requestType === 'imageUpload' ? 'operator' : 'admin';
        if (!checkPermission(requiredRole, user.roles)) {
            return this.fail(403, `No permission required role ${requiredRole}`);
        }
        try {
            const { requestType, applicant: applicantID } = record;
            await db.runTransaction(async (transaction) => {
                const applicant = await getById(USER_COLLECTION_NAME, applicantID, // id
                transaction);
                console.log('applicant', applicant);
                if (action === 'approve') {
                    switch (requestType) {
                        case 'permission': {
                            const { permissionInfo } = record;
                            console.log('permissionInfo', permissionInfo);
                            if (!permissionInfo) {
                                await transaction.rollback('申请信息不能为空');
                            }
                            const newUser = {
                                ...applicant,
                                roles: db.command.addToSet('operator'),
                                ...permissionInfo
                            };
                            await update(USER_COLLECTION_NAME, newUser, transaction);
                            break;
                        }
                        case 'imageUpload': {
                            const { imageUploadInfo } = record;
                            console.log('imageUploadInfo', imageUploadInfo);
                            if (!imageUploadInfo) {
                                await transaction.rollback('图片信息不能为空');
                            }
                            const { catID, filePaths, _createTime } = imageUploadInfo;
                            const cat = await getById(CAT_COLLECTION_NAME, catID, transaction);
                            console.log('cat', cat);
                            const newCat = {
                                ...cat,
                                _userPhotos: db.command.addToSet({
                                    $each: filePaths.map((url) => {
                                        return {
                                            url,
                                            uploader: applicantID,
                                            _createTime
                                        };
                                    })
                                })
                            };
                            const newUser = {
                                ...applicant,
                                imageUploadCount: db.command.inc(filePaths.length)
                            };
                            await update(USER_COLLECTION_NAME, newUser, transaction);
                            await update(CAT_COLLECTION_NAME, newCat, transaction);
                            break;
                        }
                    }
                }
                const newRequest = {
                    ...record,
                    status: action === 'approve' ? 'approved' : 'denied'
                };
                await update(REQUEST_COLLECTION_NAME, newRequest, transaction);
                console.log('transaction finished');
            });
        }
        catch (e) {
            console.error('transaction failed', e);
            return this.fail(500, '操作失败');
        }
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
