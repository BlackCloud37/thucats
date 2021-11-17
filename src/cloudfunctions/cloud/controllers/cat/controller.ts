import BaseController from '../base-controller';
import {
  IController,
  Response,
  ECatAcions,
  CatSomeResult,
  EController
} from '@/typings/interfaces';

export default class CatController extends BaseController implements IController<EController.Cat> {
  public async [ECatAcions.SomeMethod](): Promise<Response<CatSomeResult>> {
    return this.fail(404, 'Boomed');
  }
}
