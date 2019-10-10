import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class AdminInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // console.log('event--->>>', event);
          }
          return event;
        },
        (err: any) => {
          // console.log('error-yupikayey', event);

          if (err instanceof HttpErrorResponse) {
            // do error handling here
            // console.log('event--->>>', event);
          }
        }
      )
    );
  }
}
