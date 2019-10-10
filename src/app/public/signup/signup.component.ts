import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState, LocalStorageService } from "@app/core";
import { PublicService } from "@app/public/public.service";
import * as fromRoot from "@app/app.reducer";
import * as fromPublic from "@app/public/public.reducer";
import { CustomValidators } from "./CustomValidators";
import { matchOtherValidator } from "./CustomValidators2";
import * as Public from "@app/public/public.actions";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "hm-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  isLoading$: Observable<boolean>;
  isSignUpSuccess$: Observable<any>;
  isSignUpFailure$: Observable<any>;
  isSignUpHttpComplete$: Observable<any>;
  isFocus = false;
  action = null;
  actionType = null;

  constructor(
    private store: Store<AppState>,
    private storageService: LocalStorageService,
    private publicService: PublicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.isSignUpSuccess$ = this.store.select(fromPublic.getSignUpSuccess);
    this.isSignUpFailure$ = this.store.select(fromPublic.getSignUpFailure);
    this.store.dispatch(new Public.GetSignUpHttpComplete(null));
    this.isSignUpHttpComplete$ = this.store.select(
      fromPublic.getSignUpHttpComplete
    );

    this.action = this.route.snapshot.paramMap.get("action");
    this.actionType = this.route.snapshot.paramMap.get("type");

    this.signUpForm = new FormGroup({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      password: new FormControl("", {
        validators: [Validators.required, CustomValidators.validateCharacters]
      }),
      rpassword: new FormControl("", {
        validators: [Validators.required, matchOtherValidator("password")]
      })
    });
  }

  onSignUpSubmit() {
    this.publicService.signUpUser(
      this.signUpForm.value.email,
      this.signUpForm.value.password,
      this.signUpForm.value.rpassword
    );
  }

  onFocus() {
    this.isFocus = true;
  }

  ngOnDestroy() {
    this.publicService.subscribeAction = this.action;
    this.publicService.subscribeActionType = this.actionType;
  }
}
