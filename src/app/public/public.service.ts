import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { UIService } from "@app/shared/ui.service";
import * as fromPublic from "./public.reducer";
import * as UI from "../shared/ui.actions";
import * as Public from "./public.actions";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { hm_api, AUTH_KEY } from "@app/shared/globals";
import { AuthData } from "@app/core/auth/auth-data.model";
import { ActionAuthLogin, ActionAuthLogout } from "@app/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class PublicService {
  private fbSubs: Subscription[] = [];
  cookieValue = "UNKNOWN";
  subscribeAction = null;
  subscribeActionType = null;

  constructor(
    private uiService: UIService,
    private store: Store<fromPublic.State>,
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  fetchAvailableHomeData() {
    this.store.dispatch(new UI.StartLoading());

    this.validateUserNoRedirect();

    this.http.get(hm_api + "page/home").subscribe(
      res => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Public.GetHomePagePayload(res["data"]));
        this.store.dispatch(new Public.GetHomePageSuccess(res["message"]));
      },
      err => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Public.GetHomePageFailure(err.error.message));
        this.uiService.showSnackbar(
          "Fetching data from server failed, please try again later",
          null,
          3000
        );
      },
      () => {
        this.store.dispatch(new UI.StopLoading());
      }
    );
  }

  fetchDashData() {
    this.store.dispatch(new UI.StartLoading());

    (async () => {
      try {
        await this.validateUser();

        const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
        if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
          this.cookieValue = this.cookieService.get(AUTH_KEY);
          const headers = new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": this.cookieValue
          });
          const options = { headers: headers };
          await this.http.get(hm_api + "page/dash", options).subscribe(
            res => {
              if (res["data"]) {
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(
                  new Public.GetDashPagePayload(res["data"][0])
                );
                this.store.dispatch(
                  new Public.GetDashPageSuccess(res["message"])
                );
                this.store.dispatch(new Public.GetDashPageFailure(null));
              }
            },
            err => {
              this.store.dispatch(new UI.StopLoading());
              this.store.dispatch(new Public.GetDashPagePayload(null));
              this.store.dispatch(new Public.GetDashPageSuccess(null));
              this.store.dispatch(
                new Public.GetDashPageFailure(err.error.message)
              );
              this.uiService.showSnackbar(
                "Fetching data from server failed, please try again later",
                null,
                3000
              );
            },
            () => {
              this.store.dispatch(new UI.StopLoading());
            }
          );
        } else {
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Public.GetDashPagePayload(null));
          this.store.dispatch(new Public.GetDashPageSuccess(null));
          this.store.dispatch(
            new Public.GetDashPageFailure("No token provided")
          );
          this.uiService.showSnackbar(
            "Fetching data from server failed, please try again later",
            null,
            3000
          );
        }
      } catch (e) {
        // handle errors as needed
        // firebaseDB.errorLog(e);
        // return res.status(500).json({ message: e.message })
      }
    })();
  }

  toggleUriStatus(val) {
    this.store.dispatch(new UI.StartLoading());

    const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
    if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
      this.cookieValue = this.cookieService.get(AUTH_KEY);
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.cookieValue
      });
      const options = { headers: headers };
      this.http
        .post(hm_api + "admin/uri-status", { uriId: val }, options)
        .subscribe(
          res => {
            this.store.dispatch(new UI.StopLoading());
            // this.store.dispatch(new Public.GetDashPagePayload(res['data'][0]));
            this.store.dispatch(new Public.GetDashPageSuccess(res["message"]));
            this.store.dispatch(new Public.GetDashPageFailure(null));
            this.fetchDashData();
          },
          err => {
            this.store.dispatch(new UI.StopLoading());
            // this.store.dispatch(new Public.GetDashPagePayload(null));
            this.store.dispatch(new Public.GetDashPageSuccess(null));
            this.store.dispatch(
              new Public.GetDashPageFailure(err.error.message)
            );
            this.uiService.showSnackbar(
              "Sorry, we have encountered some errors while processing your request, please try again later",
              null,
              3000
            );
          },
          () => {
            this.store.dispatch(new UI.StopLoading());
          }
        );
    } else {
      this.store.dispatch(new UI.StopLoading());
      this.store.dispatch(new Public.GetDashPageSuccess(null));
      this.store.dispatch(new Public.GetDashPageFailure("No token provided"));
      this.uiService.showSnackbar(
        "Sorry, we have encountered some errors while processing your request, please try again later",
        null,
        3000
      );
    }
  }

  deleteAccount() {
    this.store.dispatch(new UI.StartLoading());

    const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
    if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
      this.cookieValue = this.cookieService.get(AUTH_KEY);
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.cookieValue
      });
      const options = { headers: headers };
      this.http.delete(hm_api + "admin/delete/account", options).subscribe(
        res => {
          this.store.dispatch(new UI.StopLoading());
          // this.store.dispatch(new Public.GetDashPagePayload(res['data'][0]));
          this.store.dispatch(new Public.GetDeleteSuccess(res["message"]));
          this.store.dispatch(new Public.GetDeleteFailure(null));
          // this.store.dispatch(new ActionAuthLogout());
          this.signOutUser();
          // this.router.navigate(['/home']);
        },
        err => {
          this.store.dispatch(new UI.StopLoading());
          // this.store.dispatch(new Public.GetDashPagePayload(null));
          this.store.dispatch(new Public.GetDeleteSuccess(null));
          this.store.dispatch(new Public.GetDeleteFailure(err.error.message));
          this.uiService.showSnackbar(
            "Sorry, we have encountered some errors while processing your request, please try again later",
            null,
            3000
          );
        },
        () => {
          this.store.dispatch(new UI.StopLoading());
        }
      );
    } else {
      this.store.dispatch(new UI.StopLoading());
      this.store.dispatch(new Public.GetDeleteSuccess(null));
      this.store.dispatch(new Public.GetDeleteFailure("No token provided"));
      this.uiService.showSnackbar(
        "Sorry, we have encountered some errors while processing your request, please try again later",
        null,
        3000
      );
    }
  }

  mailUri(list: any, link: string) {
    this.store.dispatch(new Public.GetMailUriProcess("start"));

    (async () => {
      try {
        await this.validateUser();

        const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
        if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
          this.cookieValue = this.cookieService.get(AUTH_KEY);
          const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "x-access-token": this.cookieValue
          });
          const options = { headers: headers };
          const body = JSON.stringify({
            link: link,
            emailList: list
          });
          await this.http
            .post(hm_api + "page/mail-uri", body, options)
            .subscribe(
              res => {
                this.store.dispatch(new Public.GetMailUriProcess(null));
                this.store.dispatch(new Public.GetMailUriFailure(null));
                this.store.dispatch(new Public.GetMailUriSuccess("true"));
              },
              err => {
                this.store.dispatch(new Public.GetMailUriProcess(null));
                this.store.dispatch(new Public.GetMailUriProcess(null));
                this.store.dispatch(
                  new Public.GetMailUriFailure(err.error.message)
                );
                this.store.dispatch(new Public.GetMailUriSuccess(null));
                this.uiService.showSnackbar(
                  "Your request can't be processed at the moment, please try again later",
                  null,
                  3000
                );
              },
              () => {
                this.store.dispatch(new Public.GetMailUriProcess(null));
              }
            );
        } else {
          this.store.dispatch(new Public.GetMailUriProcess(null));
          this.store.dispatch(new Public.GetMailUriFailure(null));
          this.store.dispatch(new Public.GetMailUriSuccess(null));
          this.store.dispatch(
            new Public.GetDashPageFailure("No token provided")
          );
          this.uiService.showSnackbar(
            "No token provided. Can't authenticate.",
            null,
            3000
          );
        }
      } catch (e) {
        // handle errors as needed
      }
    })();
  }

  signInUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.store.dispatch(new Public.GetSignInSuccess(null));
    this.store.dispatch(new Public.GetSignInFailure(null));
    this.store.dispatch(new Public.GetSignInToken(null));

    this.http
      .post(hm_api + "auth/signin", {
        email: authData.email,
        password: authData.password
      })
      .subscribe(
        res => {
          if (res["auth"]) {
            this.store.dispatch(new ActionAuthLogin());
            this.store.dispatch(new Public.GetSignInSuccess(res["auth"]));
            this.store.dispatch(new Public.GetSignInFailure(null));
            this.store.dispatch(new Public.GetSignInToken(res["token"]));
            this.router.navigate(["/admin/dash"]);
          } else {
            // this.store.dispatch(new ActionAuthLogout());
            this.store.dispatch(new Public.GetSignInSuccess(null));
            this.store.dispatch(new Public.GetSignInFailure(res["token"]));
            this.store.dispatch(new Public.GetSignInToken(null));
          }
          this.store.dispatch(new UI.StopLoading());
        },
        err => {
          let errMessage = null;
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Public.GetSignInSuccess(null));
          this.store.dispatch(new Public.GetSignInToken(null));
          if (err.error.message) {
            errMessage = err.error.message;
          } else {
            errMessage = "Service temporary unavailable";
          }
          this.store.dispatch(new Public.GetSignInFailure(errMessage));
          this.uiService.showSnackbar(errMessage, null, 3000);
        },
        () => {
          this.store.dispatch(new UI.StopLoading());
        }
      );
  }

  forgotPassword(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.store.dispatch(new Public.GetSignInSuccess(null));
    this.store.dispatch(new Public.GetSignInFailure(null));
    this.store.dispatch(new Public.GetSignInResetPwdRes(null));

    this.http
      .post(hm_api + "auth/forgot-password", {
        email: authData.email
      })
      .subscribe(
        res => {
          this.store.dispatch(new Public.GetSignInResetPwdRes("true"));
          this.store.dispatch(new Public.ShowPasswordReset(null));
          this.store.dispatch(new UI.StopLoading());
        },
        err => {
          let errMessage = null;
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Public.GetSignInSuccess(null));
          this.store.dispatch(new Public.GetSignInToken(null));
          this.store.dispatch(new Public.GetSignInResetPwdRes(null));
          this.store.dispatch(new Public.ShowPasswordReset(null));
          if (err.error.message) {
            errMessage = err.error.message;
          } else {
            errMessage = "Service temporary unavailable";
          }
          this.store.dispatch(new Public.GetSignInFailure(errMessage));
          this.uiService.showSnackbar(errMessage, null, 3000);
        },
        () => {
          this.store.dispatch(new UI.StopLoading());
        }
      );
  }

  signUpUser(email, password, rpassword) {
    this.store.dispatch(new UI.StartLoading());

    this.http
      .post(hm_api + "auth/signup", {
        email: email,
        password: password,
        rpassword: rpassword
      })
      .subscribe(
        res => {
          this.store.dispatch(new Public.GetSignUpSuccess(res["auth"]));
          this.store.dispatch(new Public.GetSignUpFailure(null));
          this.store.dispatch(new Public.GetSignInToken(res["token"]));
          this.store.dispatch(new ActionAuthLogin());
          setTimeout((_this = this) => {
            const loop = () => {
              const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
              if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
                _this.router.navigate(["/admin/dash"]);
                this.store.dispatch(new UI.StopLoading());
              } else {
                setTimeout(() => {
                  loop();
                }, 2000);
              }
            };
            loop();
          }, 3000);
        },
        err => {
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Public.GetSignUpSuccess(null));
          if (err.error.message) {
            this.store.dispatch(new Public.GetSignUpFailure(err.error.message));
          } else {
            this.store.dispatch(
              new Public.GetSignUpFailure("Service temporary unavailable.")
            );
          }
          this.uiService.showSnackbar(
            "Sorry, we encountered some errors while processing your request",
            null,
            3000
          );
        },
        () => {
          this.store.dispatch(new Public.GetSignUpHttpComplete("true"));
        }
      );
  }

  validateUserNoRedirect() {
    const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
    if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
      this.cookieValue = this.cookieService.get(AUTH_KEY);
      const headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": this.cookieValue
      });
      const options = { headers: headers };

      this.http.get(hm_api + "auth/me", options).subscribe(
        res => {
          if (res["auth"] === "true") {
            this.store.dispatch(new Public.GetSignInToken(this.cookieValue));
            this.store.dispatch(new ActionAuthLogin());
          } else if (res["auth"] === "re-auth") {
            this.store.dispatch(new Public.GetSignInToken(res["token"]));
            this.store.dispatch(new ActionAuthLogin());
          } else {
            this.store.dispatch(new Public.GetSignInFailure(res["message"]));
            this.store.dispatch(new Public.GetSignInSuccess(null));
            this.store.dispatch(new Public.GetSignInToken(null));
          }
        },
        err => {
          this.store.dispatch(new Public.GetSignInFailure(err.error.message));
          this.store.dispatch(new Public.GetSignInSuccess(null));
          this.store.dispatch(new Public.GetSignInToken(null));
        },
        () => {}
      );
    } else {
      this.store.dispatch(new Public.GetSignInFailure(null));
      this.store.dispatch(new Public.GetSignInSuccess(null));
      this.store.dispatch(new Public.GetSignInToken(null));
    }
  }

  validateUser(path?: string) {
    const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
    if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
      this.cookieValue = this.cookieService.get(AUTH_KEY);
      const headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": this.cookieValue
      });
      const options = { headers: headers };

      this.http.get(hm_api + "auth/me", options).subscribe(
        res => {
          if (res["auth"] === "true") {
            this.store.dispatch(new Public.GetSignInToken(this.cookieValue));
            this.store.dispatch(new ActionAuthLogin());
          } else if (res["auth"] === "re-auth") {
            this.store.dispatch(new Public.GetSignInToken(res["token"]));
            this.store.dispatch(new ActionAuthLogin());
          } else {
            this.store.dispatch(new Public.GetSignInFailure(res["message"]));
            this.store.dispatch(new Public.GetSignInSuccess(null));
            this.store.dispatch(new Public.GetSignInToken(null));
            if (path !== "signin") this.signOutUser();
          }
        },
        err => {
          // this.store.dispatch(new Public.GetSignInFailure(err.error.message));
          this.store.dispatch(new Public.GetSignInSuccess(null));
          this.store.dispatch(new Public.GetSignInToken(null));
          if (path !== "signin") this.signOutUser();

          if (this.cookieService.get(AUTH_KEY) !== null) {
            this.uiService.showSnackbar(
              "Your session has expired, please Sign In again.",
              null,
              3000
            );
          }
          if (path !== "signin") this.router.navigate(["/signin"]);
        },
        () => {}
      );
    } else {
      this.store.dispatch(new Public.GetSignInFailure(null));
      this.store.dispatch(new Public.GetSignInSuccess(null));
      this.store.dispatch(new Public.GetSignInToken(null));
      if (path !== "signin") this.router.navigate(["/signin"]);
    }
  }

  signOutUser() {
    this.http.get(hm_api + "auth/signout").subscribe(
      res => {
        this.store.dispatch(new ActionAuthLogout());
        this.router.navigate(["/signin"]);
        this.store.dispatch(new Public.GetSignInToken(null));
        this.cookieService.set(AUTH_KEY, null);
        this.store.dispatch(new UI.StopLoading());
      },
      err => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new ActionAuthLogout());
        this.cookieService.set(AUTH_KEY, null);
        const errMessage = err.error.message
          ? err.error.message
          : "Service temporary unavailable";
        this.uiService.showSnackbar(errMessage, null, 3000);
        this.router.navigate(["/signin"]);
      },
      () => {
        this.store.dispatch(new UI.StopLoading());
      }
    );
  }

  hit() {
    this.http
      .get(hm_api + "page/hit")
      .subscribe(res => {}, err => {}, () => {});
  }
}
