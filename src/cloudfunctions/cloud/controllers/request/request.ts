import BaseController from '../base-controller';
import { IController, EController, EApplicationActions, Response } from '../../typings';
import { UpdateApplicationRequest, UpdateApplicationResult } from '../../typings/interfaces';
// import { Request, Role, User } from '@/models/users';
import { checkPermission } from '../../utils';
import { getRequestById, updateRequest, Request } from './db';
import { getCurrentUser, getUserById, Role, updateUser, User } from '../user/db';

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

    const record = await getRequestById(requestId);

    if (record.status !== 'pending') {
      return this.fail(500, 'Can only update pending request');
    }

    const requiredRole: Role = record.requestType === 'imageUpload' ? 'operator' : 'admin';
    if (!checkPermission(requiredRole, user)) {
      return this.fail(403, `No permission required role ${requiredRole}`);
    }

    // WARNING: no transaction here
    if (action === 'approve') {
      switch (record.requestType) {
        case 'permission': {
          const applicantId = record.applicant;
          const applicant = await getUserById(applicantId);
          console.log('applicant', applicant);

          const roleSet = new Set(applicant.roles);
          roleSet.add('operator');

          const newRecord: User = {
            ...applicant,
            roles: Array.from(roleSet)
          };
          await updateUser(applicantId, newRecord);
          break;
        }
        case 'imageUpload': {
          // TODO:
          break;
        }
      }
    }

    const newRecord: Request = {
      ...record,
      status: action === 'approve' ? 'approved' : 'denied'
    };
    await updateRequest(requestId, newRecord);

    return this.success({ _id: requestId });
  }
}
