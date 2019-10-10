import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { RespondCode } from "@app/admin/respond-code.model";

@Injectable({
  providedIn: "root"
})
export class AdminService {
  private fbSubs: Subscription[] = [];
  private resCode: RespondCode;
  cookieValue = "UNKNOWN";

  constructor() {}

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
