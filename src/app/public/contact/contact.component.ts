import { Component, OnInit } from "@angular/core";
import { PublicService } from "@app/public/public.service";
import { Store } from "@ngrx/store";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as fromPublic from "@app/public/public.reducer";
import { hm_api } from "@app/shared/globals";
import { HttpClient } from "@angular/common/http";
import { UIService } from "@app/shared/ui.service";

@Component({
  selector: "hm-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;

  isContactSendSuccess = false;
  isContactSendFailure = false;
  isContactSendInProcess = false;

  constructor(
    private publicService: PublicService,
    private store: Store<fromPublic.State>,
    private http: HttpClient,
    private uiService: UIService
  ) {}

  onSubmitContact() {
    this.isContactSendInProcess = true;

    this.http
      .post(hm_api + "page/contact", {
        n: this.contactForm.value.name,
        e: this.contactForm.value.email,
        m: this.contactForm.value.message
      })
      .subscribe(
        res => {
          this.isContactSendInProcess = false;
          this.isContactSendSuccess = true;
        },
        err => {
          this.isContactSendInProcess = false;
          this.isContactSendFailure = err.error.message;
          this.uiService.showSnackbar(
            "Error: We couldn't process your request at the moment.",
            null,
            3000
          );
        },
        () => {
          this.isContactSendInProcess = false;
        }
      );
  }

  closeAlert() {
    this.isContactSendSuccess = false;
  }

  ngOnInit() {
    this.publicService.validateUserNoRedirect();
    this.contactForm = new FormGroup({
      name: new FormControl("", {
        validators: [Validators.required]
      }),
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      message: new FormControl("", {
        validators: [Validators.required]
      })
    });
  }
}
