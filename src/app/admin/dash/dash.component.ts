import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "@app/core";
import { PublicService } from "@app/public/public.service";
import { Router } from "@angular/router";
import { UIService } from "@app/shared/ui.service";
import { DataService } from "./../admin.data.service";
import * as fromPublic from "@app/public/public.reducer";
import * as fromRoot from "@app/app.reducer";
import { MatDialog } from "@angular/material";
import { DashModalComponent } from "@app/admin/dash/dash-modal.component";
import { AUTH_KEY, hm_api, hm_api_front_end } from "@app/shared/globals";
import * as Public from "@app/public/public.actions";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "hm-dash",
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashComponent implements OnInit, OnDestroy {
  dashPagePayload$: Observable<any>;
  dashPageSuccess$: Observable<any>;
  dashPageFailure$: Observable<any>;
  mailUriSuccess$: Observable<any>;
  mailUriFailure$: Observable<any>;
  mailUriProcess$: Observable<any>;
  isLoading$: Observable<boolean>;
  collectionId: string;
  cookieValue = "UNKNOWN";
  isCancelSubscriptionActive = false;
  action = null;
  actionType = null;
  hm_api_base = hm_api_front_end;
  @ViewChild("valueUri")
  valueUri;

  constructor(
    private store: Store<AppState>,
    private publicService: PublicService,
    private router: Router,
    private uiService: UIService,
    private dataService: DataService,
    public dialog: MatDialog,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.dashPagePayload$ = this.store.select(fromPublic.getDashPagePayload);
    this.dashPageSuccess$ = this.store.select(fromPublic.getDashPageSuccess);
    this.dashPageFailure$ = this.store.select(fromPublic.getDashPageFailure);

    this.mailUriSuccess$ = this.store.select(fromPublic.getMailUriSuccess);
    this.mailUriSuccess$.subscribe(() => {
      setTimeout(() => {
        this.store.dispatch(new Public.GetMailUriSuccess(null));
      }, 5000);
    });
    this.mailUriFailure$ = this.store.select(fromPublic.getMailUriFailure);
    this.mailUriFailure$.subscribe(() => {
      setTimeout(() => {
        this.store.dispatch(new Public.GetMailUriFailure(null));
      }, 5000);
    });
    this.mailUriProcess$ = this.store.select(fromPublic.getMailUriProcess);

    this.dataService.currentCollectionId.subscribe(
      collectionId => (this.collectionId = collectionId)
    );

    this.action = this.publicService.subscribeAction;
    this.actionType = this.publicService.subscribeActionType;

    if (
      this.action &&
      this.action === "subscribe" &&
      this.actionType &&
      (this.actionType === "personal" || this.actionType === "business")
    ) {
      if (this.actionType === "personal") {
        this.router.navigate(["/admin/payment", this.action, this.actionType]);
      }
    } else {
      // TODO: uncomment below line in order to lock this page for registered and logged users
      this.publicService.fetchDashData();
    }
  }

  ngOnDestroy() {
    if (this.actionType === "free") {
      this.publicService.subscribeAction = null;
      this.publicService.subscribeActionType = null;
    } else {
      this.publicService.subscribeAction = this.action;
      this.publicService.subscribeActionType = this.actionType;
    }
  }

  goToGallery(collectionId) {
    this.dataService.changeCollectionId(collectionId);
    this.router.navigate(["/admin/gallery"]);
  }

  goToUpload() {
    this.router.navigate(["/admin/upload"]);
  }

  copyUriToClipboard() {
    this.uiService.showSnackbar("URL copied to your clipboard!", null, 3000);
  }

  upgradeSubscription() {
    this.router.navigate(["/pricing"]);
  }

  toggleUri(val) {
    this.publicService.toggleUriStatus(val);
  }

  deleteAccount() {
    this.publicService.deleteAccount();
  }

  cancelSubscription() {
    // this.publicService.cancelSubscription();
    this.isCancelSubscriptionActive = true;

    const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
    if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
      this.cookieValue = this.cookieService.get(AUTH_KEY);
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.cookieValue
      });
      const options = { headers: headers };
      this.http
        .post(hm_api + "admin/cancel-subscription", {}, options)
        .subscribe(
          res => {
            window.location.reload();
            this.isCancelSubscriptionActive = false;
          },
          err => {
            this.isCancelSubscriptionActive = false;
            this.uiService.showSnackbar(
              "Sorry, we have encountered some errors while processing your request, please try again later.",
              null,
              6000
            );
          },
          () => {
            this.isCancelSubscriptionActive = false;
          }
        );
    } else {
      this.isCancelSubscriptionActive = false;
      this.uiService.showSnackbar(
        "Sorry, we have encountered some errors while processing your request, please try again later.",
        null,
        6000
      );
    }
  }

  startTimer(duration, display) {
    let start = Date.now(),
      diff,
      minutes,
      seconds;
    function timer() {
      // get the number of seconds that have elapsed since
      // startTimer() was called
      diff = duration - ((Date.now() - start) / 1000 || 0);

      // does the same job as parseInt truncates the float
      minutes = diff / 60 || 0;
      seconds = diff % 60 || 0;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (diff <= 0) {
        // add one second so that the count down starts at the full duration
        // example 05:00 not 04:59
        start = Date.now() + 1000;
      }
    }
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DashModalComponent, {
      height: "400px",
      width: "600px",
      hasBackdrop: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const link =
          hm_api_front_end + "gallery/" + this.valueUri.nativeElement.value;
        this.publicService.mailUri(result, link);
      }
    });

    dialogRef.backdropClick().subscribe(() => {
      // Close the dialog
      dialogRef.close();
    });
  }
}
