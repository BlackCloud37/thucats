export const enum EController {
  // Modify: add new controller
  User = 'user',
  Cat = 'cat'
}

// prettier-ignore
// Modify: add Controller to Action
export type ActionFor<C extends EController> = 
  C extends EController.User ? EUserActions :
  C extends EController.Cat  ? ECatAcions:
  never;

// Modify: add new EActions
export const enum EUserActions {
  Login = 'login'
}

export const enum ECatAcions {
  SomeMethod = 'somemethod'
}
