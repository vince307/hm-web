import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { Store } from "@ngrx/store";
import { AppState } from "@app/core";

@Component({
  selector: "mail-items-main-modal",
  templateUrl: "mail-items-main-modal.component.html",
  styleUrls: ["./mail-items-main-modal.component.scss"]
})
export class MailItemsMainModalComponent implements OnInit, AfterViewInit {
  genericInputObject = {
    btnIcon: "fas hm-btn-icon fa-plus",
    value: "",
    action: "add",
    valid: true
  };
  removeBtnObject = {
    btnIcon: "fas hm-btn-icon-danger fa-minus",
    value: "",
    action: "remove",
    valid: true
  };
  emailAddressList = [this.genericInputObject];
  emailMessage =
    "Hi, I'm sending you few of my images I wanted to share with you. Enjoy!";
  re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    public dialogRef: MatDialogRef<MailItemsMainModalComponent>,
    private store: Store<AppState>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  onKey(event: any, i: number) {
    // without type info
    this.emailAddressList[i]["valid"] = this.re.test(
      String(this.emailAddressList[i].value).toLowerCase()
    );
  }

  ngAfterViewInit() {}

  onClickSend() {
    let isListValid = true;
    const list = [];
    this.emailAddressList.forEach((val: any, key: any) => {
      if (!this.re.test(String(val.value).toLowerCase())) {
        this.emailAddressList[key]["valid"] = false;
        isListValid = false;
      } else {
        list.push(val.value);
      }
    });

    if (isListValid) {
      const payload = {
        list: list,
        message: this.emailMessage
      };
      this.dialogRef.close(payload);
    }
  }

  addInput(index, item, action) {
    const genericInputObject = {
      btnIcon: "fas hm-btn-icon fa-plus",
      value: "",
      action: "add",
      valid: true
    };
    if (action === "add") {
      this.emailAddressList.push(genericInputObject);
      this.emailAddressList[index]["btnIcon"] =
        "fas hm-btn-icon-danger fa-minus";
      this.emailAddressList[index]["action"] = "remove";
    } else if (
      action === "remove" &&
      index === this.emailAddressList.length - 1
    ) {
      this.emailAddressList = this.emailAddressList.filter(
        el => el !== this.emailAddressList[index]
      );
      this.emailAddressList[this.emailAddressList.length - 1]["btnIcon"] =
        "fas hm-btn-icon fa-plus";
      this.emailAddressList[this.emailAddressList.length - 1]["action"] = "add";
    } else {
      this.emailAddressList = this.emailAddressList.filter(
        el => el !== this.emailAddressList[index]
      );
    }
  }
}
