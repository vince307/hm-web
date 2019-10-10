import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { PublicService } from "@app/public/public.service";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { AppState, selectIsAuthenticated } from "@app/core";
import { environment } from "@env/environment";
import { Router } from "@angular/router";
import { AUTH_KEY, hm_api } from "@app/shared/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UIService } from "@app/shared/ui.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "hm-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit, OnDestroy {
  isAuthenticated$: Observable<boolean>;
  isPersonal = false;
  isBusiness = false;
  action = null;
  actionType = null;
  handler: any;
  cookieValue = "UNKNOWN";
  isProcessingPayment = false;

  constructor(
    private publicService: PublicService,
    private store: Store<AppState>,
    private router: Router,
    private uiService: UIService,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));

    this.publicService.validateUser();

    this.configHandler();

    this.action = this.publicService.subscribeAction;
    this.actionType = this.publicService.subscribeActionType;
    if (this.actionType === "business") {
      this.isBusiness = true;
    }
    this.isPersonal = !this.isBusiness;

    if (
      (this.actionType !== "business" || this.actionType !== "personal") &&
      this.action !== "subscribe"
    ) {
      this.router.navigate(["/pricing"]);
    }
  }

  private configHandler() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: "./../../../assets/happymarcel-stripe-icon.png",
      locale: "auto",
      token: token => {
        this.isProcessingPayment = true;
        this.processPayment(token, this.actionType);
      }
    });
  }

  openHandlerForPersonalPlan() {
    this.handler.open({
      name: "Personal Plan",
      excerpt: "Personal Subscription",
      amount: 495
    });
  }

  openHandlerForBusinessPlan() {
    this.handler.open({
      name: "Personal Plan",
      excerpt: "Personal Subscription",
      amount: 895
    });
  }

  ngOnDestroy() {
    this.publicService.subscribeAction = null;
    this.publicService.subscribeActionType = null;
  }

  private loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement("script");
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  processPayment(token: any, plan: string) {
    this.isProcessingPayment = true;

    const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
    if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
      this.cookieValue = this.cookieService.get(AUTH_KEY);
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.cookieValue
      });
      const options = { headers: headers };
      this.http
        .post(
          hm_api + "admin/payment",
          {
            st: token,
            plan: plan
          },
          options
        )
        .subscribe(
          res => {
            this.router.navigate(["/admin/dash"]);
            this.isProcessingPayment = false;
          },
          err => {
            this.isProcessingPayment = false;
            this.uiService.showSnackbar(
              "Sorry, we have encountered some errors while processing your request, please try again later. Your credit card has NOT been charged.",
              null,
              6000
            );
          },
          () => {
            this.isProcessingPayment = false;
          }
        );
    } else {
      this.isProcessingPayment = false;
      this.uiService.showSnackbar(
        "Sorry, we have encountered some errors while processing your request, please try again later. Your credit card has NOT been charged.",
        null,
        6000
      );
    }
  }
}
