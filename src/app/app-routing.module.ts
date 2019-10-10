import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {
  AboutComponent,
  ContactComponent,
  SigninComponent,
  SignupComponent
} from "@app/public";
import { PricingComponent } from "@app/public/pricing/pricing.component";
import { GalleryComponent } from "@app/public/gallery/gallery.component";
import { PolicyComponent } from "@app/public/policy/policy.component";
import { PrivacyComponent } from "@app/public/privacy/privacy.component";
import { CookieComponent } from "@app/public/cookie/cookie.component";
import { TermsComponent } from "@app/public/terms/terms.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "about",
    component: AboutComponent,
    data: { title: "hm.menu.about" }
  },
  {
    path: "contact",
    component: ContactComponent,
    data: { title: "hm.menu.contact" }
  },
  {
    path: "signin",
    component: SigninComponent,
    data: { title: "hm.menu.signin" }
  },
  {
    path: "signin/:action/:type",
    component: SigninComponent,
    pathMatch: "full",
    data: { title: "hm.menu.signin" }
  },
  {
    path: "signup",
    component: SignupComponent,
    data: { title: "hm.menu.signup" }
  },
  {
    path: "signup/:action/:type",
    component: SignupComponent,
    pathMatch: "full",
    data: { title: "hm.menu.signup" }
  },
  {
    path: "pricing",
    component: PricingComponent,
    data: { title: "hm.menu.pricing" }
  },
  {
    path: "gallery/:uri",
    component: GalleryComponent,
    data: { title: "hm.menu.gallery" }
  },
  {
    path: "privacy",
    component: PrivacyComponent,
    data: { title: "hm.menu.privacy" }
  },
  {
    path: "policy",
    component: PolicyComponent,
    data: { title: "hm.menu.policy" }
  },
  {
    path: "cookie",
    component: CookieComponent,
    data: { title: "hm.menu.cookie" }
  },
  {
    path: "terms",
    component: TermsComponent,
    data: { title: "hm.menu.terms" }
  },
  {
    path: "admin",
    loadChildren: "app/admin/admin.module#AdminModule"
  },
  {
    path: "home",
    redirectTo: "home"
  },
  {
    path: "**",
    redirectTo: "home"
  }
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: "enabled"
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
