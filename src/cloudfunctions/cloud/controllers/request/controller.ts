import BaseController from '../base-controller';
import {
  IController,
  Response,
  UpdateApplicationRequest,
  UpdateApplicationResult,
  EApplicationActions,
  EController
} from '@/typings/interfaces';
import { getById, update } from '../../utils';
import { getCurrentUser } from '../user/db';
import {
  DbUser,
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

    if (!user.isAdmin) {
      return this.fail(403, `No permission.`);
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
            case 'imageUpload': {
              console.log('filePaths', record.filePaths);
              if (!record || !record.filePaths || record.filePaths.length === 0 || !record.catID) {
                await transaction.rollback('图片信息不能为空');
              }

              const cat: DbCat = await getById(CAT_COLLECTION_NAME, record.catID!, transaction);
              console.log('cat', cat);
              if (!cat) {
                await transaction.rollback('没有相关猫咪');
              }
              const newCat: DbCat = {
                ...cat,
                _relatedImageRequests: db.command.addToSet(record._id)
              };
              const newUser: DbUser = {
                ...applicant,
                imageUploadCount: db.command.inc(record.filePaths!.length)
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
