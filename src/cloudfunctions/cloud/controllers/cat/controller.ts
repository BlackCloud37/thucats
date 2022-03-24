import BaseController from '../base-controller';
import {
  IController,
  Response,
  ECatAcions,
  EController,
  UpdateCatResult,
  UpdateCatRequest,
  CAT_ALLOWED_EDIT_FIELDS,
  AddHistoryRequest,
  AddHistoryResult,
  FinishLastHistoryRequest,
  FinishLastHistoryResult
} from '@/typings/interfaces';
import { CAT_COLLECTION_NAME, DbCat } from '@/typings/db';
import { getById, update } from '../../utils';
import { getCurrentUser } from '../user/db';
import { default as _l } from 'lodash';

export default class CatController extends BaseController implements IController<EController.Cat> {
  public async [ECatAcions.Update](request: UpdateCatRequest): Promise<Response<UpdateCatResult>> {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
      return this.fail(403, '无修改权限');
    }

    const { _id, updatedFields } = request;
    const record: DbCat = await getById(CAT_COLLECTION_NAME, _id);
    if (!record) {
      return this.fail(500, '不存在该记录');
    }
    const updated = _l.pick(_l.pick(request, updatedFields), CAT_ALLOWED_EDIT_FIELDS); // 只选择允许修改的且请求表明修改了的字段修改
    await update(CAT_COLLECTION_NAME, { ...record, ...updated });
    return this.success({ _id });
  }

  public async [ECatAcions.AddHistory](
    requset: AddHistoryRequest
  ): Promise<Response<AddHistoryResult>> {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
      return this.fail(403, '无修改权限');
    }
    const { _id, history } = requset;
    const record: DbCat = await getById(CAT_COLLECTION_NAME, _id);
    if (!record) {
      return this.fail(500, '不存在该记录');
    }

    const lastHistory = _l.last(record.history);
    if (lastHistory && !lastHistory.isDone) {
      return this.fail(500, '需要先完成最后一条记录');
    }
    await update(CAT_COLLECTION_NAME, {
      ...record,
      history: db.command.push(history)
    });
    const newRec: DbCat = await getById(CAT_COLLECTION_NAME, _id);
    return this.success({ _id, history: newRec.history ? newRec.history : [] });
  }

  public async [ECatAcions.FinishLastHistory](
    requset: FinishLastHistoryRequest
  ): Promise<Response<FinishLastHistoryResult>> {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
      return this.fail(403, '无修改权限');
    }
    const { _id } = requset;
    const record: DbCat = await getById(CAT_COLLECTION_NAME, _id);
    if (!record) {
      return this.fail(500, '不存在该记录');
    }

    const { history = [] } = record;
    const lastHistory = _l.last(history);
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
