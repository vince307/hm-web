import { Action } from "@ngrx/store";

export const GET_HOME_PAGE_PAYLOAD = "[Public] Get Home Page Payload";
export const GET_HOME_PAGE_SUCCESS = "[Public] Get Home Page Success";
export const GET_HOME_PAGE_FAILURE = "[Public] Get Home Page Failure";

export const GET_CONTACT_SUCCESS = "[Public] Get Contact Success";
export const GET_CONTACT_FAILURE = "[Public] Get Contact Failure";

export const GET_SIGNIN_SUCCESS = "[Public] Get SignIn Success";
export const GET_SIGNIN_FAILURE = "[Public] Get SignIn Failure";
export const GET_SIGNIN_TOKEN = "[Public] Get SignIn Token";
export const GET_SIGNIN_RESET_PWD_RES =
  "[Public] Get SignIn Reset Password Respond";
export const SHOW_PASSWORD_RESET = "[Public] Get Show Password Reset";

export const GET_SIGNUP_SUCCESS = "[Public] Get SignUp Success";
export const GET_SIGNUP_FAILURE = "[Public] Get SignUp Failure";
export const GET_SIGNUP_TOKEN = "[Public] Get SignUp Token";
export const GET_SIGNUP_HTTP_COMPLETE = "[Public] Get SignUp Http Complete";

export const GET_DASH_PAGE_PAYLOAD = "[Public] Get Dash Page Payload";
export const GET_DASH_PAGE_SUCCESS = "[Public] Get Dash Page Success";
export const GET_DASH_PAGE_FAILURE = "[Public] Get Dash Page Failure";

export const GET_DELETE_SUCCESS = "[Public] Get Delete Success";
export const GET_DELETE_FAILURE = "[Public] Get Delete Failure";

export const GET_MAIL_URI_SUCCESS = "[Public] Get Mail Uri Success";
export const GET_MAIL_URI_FAILURE = "[Public] Get Mail Uri Failure";
export const GET_MAIL_URI_PROCESS = "[Public] Get Mail Uri Process";

export const GET_HTTP_FAILURE = "[Public] Get Http Failure";

/**
 * Home Page
 */
export class GetHomePagePayload implements Action {
  readonly type = GET_HOME_PAGE_PAYLOAD;

  constructor(public payload: []) {}
}

export class GetHomePageSuccess implements Action {
  readonly type = GET_HOME_PAGE_SUCCESS;

  constructor(public payload: string) {}
}

export class GetHomePageFailure implements Action {
  readonly type = GET_HOME_PAGE_FAILURE;

  constructor(public payload: string) {}
}
/* end Home Page */

/**
 * Dash Page
 */
export class GetDashPagePayload implements Action {
  readonly type = GET_DASH_PAGE_PAYLOAD;

  constructor(public payload: []) {}
}

export class GetDashPageSuccess implements Action {
  readonly type = GET_DASH_PAGE_SUCCESS;

  constructor(public payload: string) {}
}

export class GetDashPageFailure implements Action {
  readonly type = GET_DASH_PAGE_FAILURE;

  constructor(public payload: string) {}
}
/* end Dash Page */

/**
 * Contact Page
 */
export class GetContactSuccess implements Action {
  readonly type = GET_CONTACT_SUCCESS;

  constructor(public payload: string) {}
}

export class GetContactFailure implements Action {
  readonly type = GET_CONTACT_FAILURE;

  constructor(public payload: string) {}
}
/* end Contact Page */

/**
 * SignIn Page
 */
export class GetSignInSuccess implements Action {
  readonly type = GET_SIGNIN_SUCCESS;

  constructor(public payload: string) {}
}

export class GetSignInFailure implements Action {
  readonly type = GET_SIGNIN_FAILURE;

  constructor(public payload: string) {}
}

export class GetSignInToken implements Action {
  readonly type = GET_SIGNIN_TOKEN;

  constructor(public payload: string) {}
}

export class GetSignInResetPwdRes implements Action {
  readonly type = GET_SIGNIN_RESET_PWD_RES;

  constructor(public payload: string) {}
}
/* end SignIn Page */

/**
 * SignIn Page
 */
export class GetSignUpSuccess implements Action {
  readonly type = GET_SIGNUP_SUCCESS;

  constructor(public payload: string) {}
}

export class GetSignUpFailure implements Action {
  readonly type = GET_SIGNUP_FAILURE;

  constructor(public payload: string) {}
}

export class GetSignUpToken implements Action {
  readonly type = GET_SIGNUP_TOKEN;

  constructor(public payload: string) {}
}

export class GetSignUpHttpComplete implements Action {
  readonly type = GET_SIGNUP_HTTP_COMPLETE;

  constructor(public payload: string) {}
}

export class ShowPasswordReset implements Action {
  readonly type = SHOW_PASSWORD_RESET;

  constructor(public payload: string) {}
}
/* end SignUp Page */

/**
 * Delete Page
 */
export class GetDeleteSuccess implements Action {
  readonly type = GET_DELETE_SUCCESS;

  constructor(public payload: string) {}
}

export class GetDeleteFailure implements Action {
  readonly type = GET_DELETE_FAILURE;

  constructor(public payload: string) {}
}
/* end Delete Page */

/**
 * Mail URL
 */
export class GetMailUriSuccess implements Action {
  readonly type = GET_MAIL_URI_SUCCESS;

  constructor(public payload: string) {}
}

export class GetMailUriFailure implements Action {
  readonly type = GET_MAIL_URI_FAILURE;

  constructor(public payload: string) {}
}

export class GetMailUriProcess implements Action {
  readonly type = GET_MAIL_URI_PROCESS;

  constructor(public payload: string) {}
}
/* end Delete Page */

/**
 * Http Call
 */
export class GetHttpFailure implements Action {
  readonly type = GET_HTTP_FAILURE;

  constructor(public payload: string) {}
}
/* end Http Call */

/**
 * Export
 */
export type PublicActions =
  | GetHomePagePayload
  | GetHomePageSuccess
  | GetHomePageFailure
  | GetContactSuccess
  | GetContactFailure
  | GetSignInSuccess
  | GetSignInFailure
  | GetSignInToken
  | GetSignInResetPwdRes
  | ShowPasswordReset
  | GetSignUpSuccess
  | GetSignUpFailure
  | GetSignUpToken
  | GetSignUpHttpComplete
  | GetDashPagePayload
  | GetDashPageSuccess
  | GetDashPageFailure
  | GetDeleteSuccess
  | GetDeleteFailure
  | GetMailUriSuccess
  | GetMailUriFailure
  | GetMailUriProcess
  | GetHttpFailure;
