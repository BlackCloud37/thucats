import BaseController from '../base-controller';
import {
  IController,
  Response,
  UpdateApplicationRequest,
  UpdateApplicationResult,
  EApplicationActions,
  EController
} from '@/typings/interfaces';
import { checkPermission, getById, update } from '../../utils';
// import { getRequestById, updateRequest } from './db';
import { getCurrentUser } from '../user/db';
import {
  DbUser,
  Role,
  DbRequest,
  REQUEST_COLLECTION_NAME,
  USER_COLLECTION_NAME,
  DbCat,
  CAT_COLLECTION_NAME
} from '@/typings/db';

export default class ApplicationController
  extends BaseController
  implements IController<EController.Application>
{
  public async [EApplicationActions.Update]({
    requestId,
    action
  }: UpdateApplicationRequest): Promise<Response<UpdateApplicationResult>> {
    const user = await getCurrentUser();

    if (!user) {
      return this.fail(500, 'No such user');
    }

    const record: DbRequest = await getById(REQUEST_COLLECTION_NAME, requestId);

    if (record.status !== 'pending') {
      return this.fail(500, 'Can only update pending request');
    }

    const requiredRole: Role = record.requestType === 'imageUpload' ? 'operator' : 'admin';
    if (!checkPermission(requiredRole, user.roles)) {
      return this.fail(403, `No permission required role ${requiredRole}`);
    }

    try {
      const { requestType, applicant: applicantID } = record;
      await db.runTransaction(async (transaction: any) => {
        const applicant: DbUser = await getById(
          USER_COLLECTION_NAME,
          applicantID, // id
          transaction
        );
        console.log('applicant', applicant);
        if (action === 'approve') {
          switch (requestType) {
            case 'permission': {
              const { permissionInfo } = record;
              console.log('permissionInfo', permissionInfo);
              if (!permissionInfo) {
                await transaction.rollback('申请信息不能为空');
              }
              const newUser: DbUser = {
                ...applicant,
                roles: db.command.addToSet('operator' as Role),
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
              const { catID, filePaths, _createTime } = imageUploadInfo!;
              const cat: DbCat = await getById(CAT_COLLECTION_NAME, catID, transaction);
              console.log('cat', cat);
              const newCat: DbCat = {
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
              const newUser: DbUser = {
                ...applicant,
                imageUploadCount: db.command.inc(filePaths.length)
              };
              await update(USER_COLLECTION_NAME, newUser, transaction);
              await update(CAT_COLLECTION_NAME, newCat, transaction);
              break;
            }
          }
        }

        const newRequest: DbRequest = {
          ...record,
          status: action === 'approve' ? 'approved' : 'denied'
        };
        await update(REQUEST_COLLECTION_NAME, newRequest, transaction);
        console.log('transaction finished');
      });
    } catch (e: any) {
      console.error('transaction failed', e);
      return this.fail(500, '操作失败');
    }

    return this.success({ _id: requestId });
  }
}
