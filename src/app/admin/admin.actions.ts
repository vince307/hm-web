import { Action } from "@ngrx/store";

export const GET_HOME_PAGE_DATA = "[Admin] Get Home Page Data";
export const GET_HOME_PAGE_MSG = "[Admin] Get Home Page Msg";
export const GET_HOME_PAGE_CODE = "[Admin] Get Home Page Code";

export class GetHomePageData implements Action {
  readonly type = GET_HOME_PAGE_DATA;

  constructor(public payload: []) {}
}

export class GetHomePageMsg implements Action {
  readonly type = GET_HOME_PAGE_MSG;

  constructor(public payload: string) {}
}

export class GetHomePageCode implements Action {
  readonly type = GET_HOME_PAGE_CODE;

  constructor(public payload: number) {}
}

export type AdminActions = GetHomePageData | GetHomePageMsg | GetHomePageCode;
