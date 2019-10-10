import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

import {
  PublicActions,
  GET_HOME_PAGE_PAYLOAD,
  GET_HOME_PAGE_SUCCESS,
  GET_HOME_PAGE_FAILURE,
  GET_CONTACT_SUCCESS,
  GET_CONTACT_FAILURE,
  GET_SIGNIN_SUCCESS,
  GET_SIGNIN_FAILURE,
  GET_SIGNIN_TOKEN,
  GET_SIGNIN_RESET_PWD_RES,
  SHOW_PASSWORD_RESET,
  GET_SIGNUP_SUCCESS,
  GET_SIGNUP_FAILURE,
  GET_SIGNUP_TOKEN,
  GET_SIGNUP_HTTP_COMPLETE,
  GET_DASH_PAGE_PAYLOAD,
  GET_DASH_PAGE_SUCCESS,
  GET_DASH_PAGE_FAILURE,
  GET_DELETE_SUCCESS,
  GET_DELETE_FAILURE,
  GET_MAIL_URI_SUCCESS,
  GET_MAIL_URI_FAILURE,
  GET_MAIL_URI_PROCESS,
  GET_HTTP_FAILURE
} from "./public.actions";
import { RespondData } from "./respond-data.model";
import { RespondMessage } from "@app/public/respond-message.model";
import { RespondCode } from "@app/public/respond-code.model";
import * as fromRoot from "../app.reducer";

export interface PublicState {
  homePagePayload: RespondData;
  homePageSuccess: RespondMessage;
  homePageFailure: RespondMessage;
  contactSuccess: RespondMessage;
  contactFailure: RespondMessage;
  signInSuccess: RespondMessage;
  signInFailure: RespondMessage;
  signInToken: RespondMessage;
  signInResetPwdRes: RespondMessage;
  signInShowPasswordReset: RespondMessage;
  signUpSuccess: RespondMessage;
  signUpFailure: RespondMessage;
  signUpToken: RespondMessage;
  signUpHttpComplete: RespondMessage;
  dashPagePayload: RespondData;
  dashPageSuccess: RespondMessage;
  dashPageFailure: RespondMessage;
  deleteSuccess: RespondMessage;
  deleteFailure: RespondMessage;
  mailUriSuccess: RespondMessage;
  mailUriFailure: RespondMessage;
  mailUriProcess: RespondMessage;
  httpFailure: RespondMessage;
}

export interface State extends fromRoot.State {
  public: PublicState;
}

const initialState: PublicState = {
  homePagePayload: null,
  homePageSuccess: null,
  homePageFailure: null,
  contactSuccess: null,
  contactFailure: null,
  signInSuccess: null,
  signInFailure: null,
  signInToken: null,
  signInResetPwdRes: null,
  signInShowPasswordReset: null,
  signUpSuccess: null,
  signUpFailure: null,
  signUpToken: null,
  signUpHttpComplete: null,
  dashPagePayload: null,
  dashPageSuccess: null,
  dashPageFailure: null,
  deleteSuccess: null,
  deleteFailure: null,
  mailUriSuccess: null,
  mailUriFailure: null,
  mailUriProcess: null,
  httpFailure: null
};

export function publicReducer(state = initialState, action: PublicActions) {
  switch (action.type) {
    case GET_HOME_PAGE_PAYLOAD:
      return { ...state, homePagePayload: action.payload };
    case GET_HOME_PAGE_SUCCESS:
      return { ...state, homePageSuccess: action.payload };
    case GET_HOME_PAGE_FAILURE:
      return { ...state, homePageFailure: action.payload };
    case GET_CONTACT_SUCCESS:
      return { ...state, contactSuccess: action.payload };
    case GET_CONTACT_FAILURE:
      return { ...state, contactFailure: action.payload };
    case GET_SIGNIN_SUCCESS:
      return { ...state, signInSuccess: action.payload };
    case GET_SIGNIN_FAILURE:
      return { ...state, signInFailure: action.payload };
    case GET_SIGNIN_TOKEN:
      return { ...state, signInToken: action.payload };
    case GET_SIGNIN_RESET_PWD_RES:
      return { ...state, signInResetPwdRes: action.payload };
    case SHOW_PASSWORD_RESET:
      return { ...state, signInShowPasswordReset: action.payload };
    case GET_SIGNUP_SUCCESS:
      return { ...state, signUpSuccess: action.payload };
    case GET_SIGNUP_FAILURE:
      return { ...state, signUpFailure: action.payload };
    case GET_SIGNUP_TOKEN:
      return { ...state, signUpToken: action.payload };
    case GET_SIGNUP_HTTP_COMPLETE:
      return { ...state, signUpHttpComplete: action.payload };
    case GET_DASH_PAGE_PAYLOAD:
      return { ...state, dashPagePayload: action.payload };
    case GET_DASH_PAGE_SUCCESS:
      return { ...state, dashPageSuccess: action.payload };
    case GET_DASH_PAGE_FAILURE:
      return { ...state, dashPageFailure: action.payload };
    case GET_DELETE_SUCCESS:
      return { ...state, deleteSuccess: action.payload };
    case GET_DELETE_FAILURE:
      return { ...state, deleteFailure: action.payload };
    case GET_MAIL_URI_SUCCESS:
      return { ...state, mailUriSuccess: action.payload };
    case GET_MAIL_URI_FAILURE:
      return { ...state, mailUriFailure: action.payload };
    case GET_MAIL_URI_PROCESS:
      return { ...state, mailUriProcess: action.payload };
    case GET_HTTP_FAILURE:
      return { ...state, httpFailure: action.payload };
    default: {
      return state;
    }
  }
}

export const getPublicState = createFeatureSelector<PublicState>("public");

export const getHomePagePayload = createSelector(
  getPublicState,
  (state: PublicState) => state.homePagePayload
);
export const getHomePageSuccess = createSelector(
  getPublicState,
  (state: PublicState) => state.homePageSuccess
);
export const getHomePageFailure = createSelector(
  getPublicState,
  (state: PublicState) => state.homePageFailure
);

export const getContactSuccess = createSelector(
  getPublicState,
  (state: PublicState) => state.contactSuccess
);
export const getContactFailure = createSelector(
  getPublicState,
  (state: PublicState) => state.contactFailure
);

export const getSignInSuccess = createSelector(
  getPublicState,
  (state: PublicState) => state.signInSuccess
);
export const getSignInFailure = createSelector(
  getPublicState,
  (state: PublicState) => state.signInFailure
);
export const getSignInToken = createSelector(
  getPublicState,
  (state: PublicState) => state.signInToken
);
export const getSignInResetPwdRes = createSelector(
  getPublicState,
  (state: PublicState) => state.signInResetPwdRes
);
export const getShowPasswordReset = createSelector(
  getPublicState,
  (state: PublicState) => state.signInShowPasswordReset
);

export const getSignUpSuccess = createSelector(
  getPublicState,
  (state: PublicState) => state.signUpSuccess
);
export const getSignUpFailure = createSelector(
  getPublicState,
  (state: PublicState) => state.signUpFailure
);
export const getSignUpToken = createSelector(
  getPublicState,
  (state: PublicState) => state.signUpToken
);
export const getSignUpHttpComplete = createSelector(
  getPublicState,
  (state: PublicState) => state.signUpHttpComplete
);

export const getDashPagePayload = createSelector(
  getPublicState,
  (state: PublicState) => state.dashPagePayload
);
export const getDashPageSuccess = createSelector(
  getPublicState,
  (state: PublicState) => state.dashPageSuccess
);
export const getDashPageFailure = createSelector(
  getPublicState,
  (state: PublicState) => state.dashPageFailure
);

export const getDeleteSuccess = createSelector(
  getPublicState,
  (state: PublicState) => state.deleteSuccess
);
export const getDeleteFailure = createSelector(
  getPublicState,
  (state: PublicState) => state.deleteFailure
);

export const getMailUriSuccess = createSelector(
  getPublicState,
  (state: PublicState) => state.mailUriSuccess
);
export const getMailUriFailure = createSelector(
  getPublicState,
  (state: PublicState) => state.mailUriFailure
);
export const getMailUriProcess = createSelector(
  getPublicState,
  (state: PublicState) => state.mailUriProcess
);

export const getHttpFailure = createSelector(
  getPublicState,
  (state: PublicState) => state.httpFailure
);
