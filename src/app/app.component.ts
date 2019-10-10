import browser from "browser-detect";
import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";

import {
  routeAnimations,
  AppState,
  LocalStorageService,
  selectIsAuthenticated
} from "@app/core";
import { environment as env } from "@env/environment";

import { AuthService } from "@app/core/auth/auth.service";
import { FormGroup } from "@angular/forms";
import { PublicService } from "@app/public/public.service";

@Component({
  selector: "hm-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  version = env.versions.app;
  isUnderMaintenance = false; // maintenance toggle
  year = new Date().getFullYear();
  logo = require("../assets/happymarcel-icon.png");
  navigation = [
    { link: "home", label: "hm.menu.home" },
    { link: "about", label: "hm.menu.about" },
    { link: "contact", label: "hm.menu.contact" },
    { link: "pricing", label: "hm.menu.pricing" }
  ];
  navigationSideMenu = [...this.navigation];
  navigationAdminSideMenu = [
    { link: "admin/dash", label: "hm.admin.menu.dash" },
    { link: "admin/upload", label: "hm.admin.menu.upload" },
    { link: "admin/gallery", label: "hm.admin.menu.gallery" }
  ];

  isAuthenticated$: Observable<boolean>;
  theme$: Observable<string>;
  loginForm: FormGroup;

  constructor(
    private store: Store<AppState>,
    private storageService: LocalStorageService,
    private authService: AuthService,
    private publicService: PublicService
  ) {}

  private static isIEorEdgeOrSafari() {
    return ["ie", "edge", "safari"].includes(browser().name);
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();

    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));

    this.publicService.hit();
  }

  onSignInClick() {
    this.publicService.signInUser({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  onLogoutClick() {
    // this.store.dispatch(new ActionAuthLogout());
    this.publicService.signOutUser();
  }

  // onLanguageSelect({ value: language }) {
  //   this.store.dispatch(new ActionSettingsChangeLanguage({ language }));
  // }
}
