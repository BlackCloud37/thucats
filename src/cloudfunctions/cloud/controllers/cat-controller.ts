import BaseController from './base-controller';
import { ECatAcions, CatSomeResult, IController, EController, Response } from '../typings';
// declare let global: CloudFnGlobal;

export default class CatController extends BaseController implements IController<EController.Cat> {
  public async [ECatAcions.SomeMethod](): Promise<Response<CatSomeResult>> {
    return this.fail(404, 'Boom');
  }
}
