import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared";
import { HomeComponent } from "@app/public/home/home.component";
import { PublicRoutingModule } from "@app/public/public-routing.module";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { ContactComponent } from "./contact/contact.component";
import { AboutComponent } from "./about/about.component";
import { StoreModule } from "@ngrx/store";
import { PricingComponent } from "./pricing/pricing.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { uiReducer } from "@app/shared/ui.reducer";
import { publicReducer } from "@app/public/public.reducer";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AdminInterceptor } from "@app/admin/admin.interceptor";
import { NgxMasonryModule } from "ngx-masonry";
import { PrivacyComponent } from "./privacy/privacy.component";
import { PolicyComponent } from "./policy/policy.component";
import { CookieComponent } from "./cookie/cookie.component";
import { TermsComponent } from "./terms/terms.component";
import { NgxPayPalModule } from "ngx-paypal";

@NgModule({
  imports: [
    SharedModule,
    PublicRoutingModule,
    NgxMasonryModule,
    StoreModule.forFeature("public", publicReducer),
    StoreModule.forFeature("ui", uiReducer),
    NgxPayPalModule
  ],
  declarations: [
    HomeComponent,
    SigninComponent,
    SignupComponent,
    ContactComponent,
    AboutComponent,
    PricingComponent,
    GalleryComponent,
    PrivacyComponent,
    PolicyComponent,
    CookieComponent,
    TermsComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminInterceptor,
      multi: true
    }
  ]
})
export class PublicModule {}
