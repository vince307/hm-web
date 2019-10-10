import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";

import { LocalStorageService } from "../local-storage/local-storage.service";

import {
  ActionAuthLogin,
  ActionAuthLogout,
  AuthActionTypes
} from "./auth.actions";
import { AuthService } from "@app/core/auth/auth.service";
import { CookieService } from "ngx-cookie-service";
import * as fromPublic from "@app/public/public.reducer";
import { Observable } from "rxjs";
import { AUTH_KEY } from "@app/shared/globals";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private router: Router,
    private authService: AuthService,
    private store: Store<fromPublic.State>,
    private cookieService: CookieService
  ) {}

  signInToken$: Observable<any>;

  @Effect({ dispatch: false })
  login = this.actions$.pipe(
    ofType<ActionAuthLogin>(AuthActionTypes.LOGIN),
    tap(() => {
      (async () => {
        try {
          this.signInToken$ = this.store.select(fromPublic.getSignInToken);
          await this.signInToken$.subscribe(val => {
            this.cookieService.set(AUTH_KEY, val);
          });
        } catch (e) {
          // handle errors as needed
          // firebaseDB.errorLog(e);
          // return res.status(500).json({ message: e.message })
        }
      })();
    })
  );

  @Effect({ dispatch: false })
  logout = this.actions$.pipe(
    ofType<ActionAuthLogout>(AuthActionTypes.LOGOUT),
    tap(() => {
      this.router.navigate([""]);
      const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
      if (cookieExists) {
        this.cookieService.set(AUTH_KEY, null);
      }
    })
  );
}
