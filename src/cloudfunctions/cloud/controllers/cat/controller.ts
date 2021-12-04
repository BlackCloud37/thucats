import BaseController from '../base-controller';
import {
  IController,
  Response,
  ECatAcions,
  EController,
  UpdateCatResult,
  UpdateCatRequest
} from '@/typings/interfaces';
import { CAT_COLLECTION_NAME, DbCat } from '@/typings/db';
import { checkPermission, getById, update } from '../../utils';
import { getCurrentUser } from '../user/db';

export default class CatController extends BaseController implements IController<EController.Cat> {
  public async [ECatAcions.Update](request: UpdateCatRequest): Promise<Response<UpdateCatResult>> {
    const user = await getCurrentUser();
    if (!checkPermission('operator', user ? user.roles : [])) {
      this.fail(403, '无修改权限');
    }

    const { _id, updatedFields } = request;
    const record: DbCat = await getById(CAT_COLLECTION_NAME, _id);
    if (!record) {
      this.fail(500, '不存在该记录');
    }
    const updated: any = {};
    updatedFields.forEach((k) => {
      updated[k] = request[k];
    });
    await update(CAT_COLLECTION_NAME, { ...record, status, history });
    return this.success({ _id });
  }
}
