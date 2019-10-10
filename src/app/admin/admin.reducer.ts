import { createFeatureSelector, createSelector } from "@ngrx/store";

import {
  AdminActions,
  GET_HOME_PAGE_DATA,
  GET_HOME_PAGE_MSG,
  GET_HOME_PAGE_CODE
} from "./admin.actions";
import { RespondData } from "./respond-data.model";
import * as fromRoot from "../app.reducer";
import { RespondMessage } from "@app/admin/respond-message.model";
import { RespondCode } from "@app/admin/respond-code.model";

export interface AdminState {
  homePageData: RespondData;
  homePageMsg: RespondMessage;
  homePageCode: RespondCode;
}

export interface State extends fromRoot.State {
  admin: AdminState;
}

const initialState: AdminState = {
  homePageData: null,
  homePageMsg: null,
  homePageCode: null
};

export function adminReducer(state = initialState, action: AdminActions) {
  switch (action.type) {
    case GET_HOME_PAGE_DATA:
      return {
        ...state,
        homePageData: action.payload
      };
    case GET_HOME_PAGE_MSG:
      return {
        ...state,
        homePageMsg: action.payload
      };
    case GET_HOME_PAGE_CODE:
      return {
        ...state,
        homePageCode: action.payload
      };
    default: {
      return state;
    }
  }
}

export const getAdminState = createFeatureSelector<AdminState>("admin");

export const getHomePageData = createSelector(
  getAdminState,
  (state: AdminState) => state.homePageData
);
export const getHomePageMsg = createSelector(
  getAdminState,
  (state: AdminState) => state.homePageMsg
);
export const getHomePageCode = createSelector(
  getAdminState,
  (state: AdminState) => state.homePageCode
);
