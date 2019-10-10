import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import {
  AppState,
  LocalStorageService,
  selectIsAuthenticated
} from "@app/core";
import { select, Store } from "@ngrx/store";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import * as fromRoot from "../../app.reducer";
import * as fromPublic from "../public.reducer";
import { PublicService } from "@app/public/public.service";
import * as Public from "@app/public/public.actions";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "hm-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private storageService: LocalStorageService,
    private publicService: PublicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  signinForm: FormGroup;
  resetPasswordForm: FormGroup;
  isLoading$: Observable<boolean>;
  getSignInSuccess$: Observable<any>;
  getSignInFailure$: Observable<any>;
  getSignInResetPwdRes$: Observable<any>;
  showPasswordReset$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  action = null;
  actionType = null;

  ngOnInit() {
    this.action = this.route.snapshot.paramMap.get("action");
    this.actionType = this.route.snapshot.paramMap.get("type");
    // console.log(this.action);
    // console.log(this.actionType);

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.getSignInSuccess$ = this.store.select(fromPublic.getSignInSuccess);
    this.showPasswordReset$ = this.store.select(
      fromPublic.getShowPasswordReset
    );
    this.getSignInFailure$ = this.store.select(fromPublic.getSignInFailure);
    this.getSignInFailure$.subscribe(() => {
      setTimeout(() => {
        this.store.dispatch(new Public.GetSignInFailure(null));
      }, 5000);
    });
    this.getSignInResetPwdRes$ = this.store.select(
      fromPublic.getSignInResetPwdRes
    );
    this.getSignInResetPwdRes$.subscribe(() => {
      setTimeout(() => {
        this.store.dispatch(new Public.GetSignInResetPwdRes(null));
      }, 4000);
    });

    this.signinForm = new FormGroup({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      password: new FormControl("", {
        validators: [Validators.required]
      })
    });

    this.resetPasswordForm = new FormGroup({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      )
    });

    this.publicService.validateUser("signin");

    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.isAuthenticated$.subscribe(respond => {
      // console.log(respond)
      if (respond && this.action && this.actionType) {
        this.publicService.subscribeAction = this.action;
        this.publicService.subscribeActionType = this.actionType;
        // console.log(this.publicService.subscribeActionType);
        // console.log('redirect')
        this.router.navigate(["/admin/dash"]);
      }
    });
  }

  onSignInClick() {
    this.publicService.signInUser({
      email: this.signinForm.value.email,
      password: this.signinForm.value.password
    });
  }

  forgotPassword() {
    this.store.dispatch(new Public.ShowPasswordReset("true"));
  }

  needAccount() {
    this.router.navigate(["signup", this.action, this.actionType]);
  }

  onForgotPasswordSubmitClick() {
    this.publicService.forgotPassword({
      email: this.resetPasswordForm.value.email,
      password: ""
    });
  }

  ngOnDestroy() {
    this.publicService.subscribeAction = this.action;
    this.publicService.subscribeActionType = this.actionType;
  }
}
