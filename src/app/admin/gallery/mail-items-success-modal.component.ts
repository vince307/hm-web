import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "mail-items-success-modal",
  templateUrl: "mail-items-success-modal.component.html",
  styleUrls: ["./mail-items-success-modal.component.scss"]
})
export class MailItemsSuccessModalComponent implements OnInit, AfterViewInit {
  constructor(public dialogRef: MatDialogRef<MailItemsSuccessModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  ngAfterViewInit() {}
}
