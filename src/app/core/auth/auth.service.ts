import { Injectable } from "@angular/core";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { UIService } from "@app/shared/ui.service";
import * as fromRoot from "@app/app.reducer";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor() {}

  // cookie settings
  // httpOnly
  // SameSite=strict
  // secure=true
  //
  // Ensure the entire site was served over HTTPS
  // Ensure the use of HSTS
  // Ensure that, once live, only the actual redirect URL was included in the Auth0 rules, as well as our source code
  // We use the Angular CLI. It turns out that, despite the tree shaking provided by WebPack, unused variables still show up in the compiled source code, for example localhost:4200
  // Make sure that there are no localhost URl's actually on Auth0 (on the allowed redirect page, for your client). Make a seperate Auth0 account for testing
  // Add the X-Frame-Options header to every HTTP response, and set it to Deny
  // Set X-XSS-Protection to 1
  // Set X-Content-Type-Options to nosniff
  // Make sure Content-Security-Policy is restricted to your own domain name, and any CDN's you may be pulling scripts in from
  // Set Referrer-Policy to same-origin
  // Limit the JWT expiry on Auth0 to 1 hour
  //
  // test website security:
  // https://securityheaders.com/
}
