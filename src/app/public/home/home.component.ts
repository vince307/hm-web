import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { PublicService } from "@app/public/public.service";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromPublic from "../public.reducer";
import * as fromRoot from "@app/app.reducer";
import { Router } from "@angular/router";

@Component({
  selector: "hm-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  homePagePayload$: Observable<any>;
  homePageSuccess$: Observable<any>;
  homePageFailure$: Observable<any>;
  isLoading$: Observable<boolean>;
  cards = [
    { title: "Images", icon: '<i class="fas fa-image fa-4x"></i>', val: null },
    { title: "Videos", icon: '<i class="fas fa-video fa-4x"></i>', val: null },
    { title: "Processed", icon: '<i class="fas fa-cogs fa-4x"></i>', val: null }
  ];

  constructor(
    private publicService: PublicService,
    private store: Store<fromPublic.State>,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.homePagePayload$ = this.store.select(fromPublic.getHomePagePayload);
    this.homePagePayload$.subscribe(val => {
      if (val) {
        this.cards[0]["val"] = val[0];
        this.cards[1]["val"] = val[1];
        this.cards[2]["val"] = val[2];
      }
    });
    this.homePageSuccess$ = this.store.select(fromPublic.getHomePageSuccess);
    this.homePageFailure$ = this.store.select(fromPublic.getHomePageFailure);
    this.publicService.fetchAvailableHomeData();
  }

  goToSignUp() {
    this.router.navigate(["/signup"]);
  }
}
