import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "mail-items-error-modal",
  templateUrl: "mail-items-error-modal.component.html",
  styleUrls: ["./mail-items-error-modal.component.scss"]
})
export class MailItemsErrorModalComponent implements OnInit, AfterViewInit {
  constructor(public dialogRef: MatDialogRef<MailItemsErrorModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  ngAfterViewInit() {}
}
