import BaseController from './base-controller';
import { IController, EController, EApplicationActions, Response } from '../typings';

export default class ApplicationController
  extends BaseController
  implements IController<EController.Application>
{
  public async [EApplicationActions.SomeMethod](): Promise<Response<{}>> {
    return this.fail(404, 'Boomed');
  }
  // public async [EApplicationActions.Create]({
  //   request
  // }: CreateApplicationRequest): Promise<Response<CreateApplicationResponse>> {
  //   return this.fail(404, 'Boomed');
  // }
  // public async [EApplicationActions.Update]({
  //   some
  // }: UpdateApplicationRequest): Promise<Response<UpdateApplicationResponse>> {
  //   return this.fail(404, 'Boomed');
  // }
}
