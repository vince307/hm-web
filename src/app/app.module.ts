import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { SharedModule } from "@app/shared";
import { CoreModule } from "@app/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PublicModule } from "@app/public";
import { UIService } from "@app/shared/ui.service";
import { CookieService } from "ngx-cookie-service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AdminInterceptor } from "@app/admin/admin.interceptor";

@NgModule({
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core & shared
    CoreModule,
    SharedModule,

    // app
    AppRoutingModule,

    // public
    PublicModule
  ],
  declarations: [AppComponent],
  providers: [
    UIService,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
