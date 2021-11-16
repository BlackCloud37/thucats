export const enum EController {
  // Modify: add new controller
  User = 'user',
  Cat = 'cat',
  Application = 'request' // Request和请求有歧义，重命名一下
}

// prettier-ignore
// Modify: add Controller to Action
export type ActionFor<C extends EController> = 
  C extends EController.User ? EUserActions :
  C extends EController.Cat  ? ECatAcions:
  C extends EController.Application ? EApplicationActions:
  never;

// Modify: add new EActions
export const enum EUserActions {
  Login = 'login'
}

export const enum ECatAcions {
  SomeMethod = 'somemethod'
}

export const enum EApplicationActions {
  // // 发起申请
  // Create = 'create',
  // 同意、取消申请
  Update = 'update'
}
