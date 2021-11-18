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
  USER_COLLECTION_NAME
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

    // WARNING: no transaction here
    if (action === 'approve') {
      switch (record.requestType) {
        case 'permission': {
          const applicantId = record.applicant;
          const applicant: DbUser = await getById(USER_COLLECTION_NAME, applicantId);
          console.log('applicant', applicant);

          const roleSet = new Set([...applicant.roles, 'operator' as Role]); // 默认增加operator权限

          const newUser: DbUser = {
            ...applicant,
            roles: Array.from(roleSet)
          };
          await update(USER_COLLECTION_NAME, newUser);
          break;
        }
        case 'imageUpload': {
          // TODO:
          break;
        }
      }
    }

    const newRequest: DbRequest = {
      ...record,
      status: action === 'approve' ? 'approved' : 'denied'
    };
    await update(REQUEST_COLLECTION_NAME, newRequest);

    return this.success({ _id: requestId });
  }
}
