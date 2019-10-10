import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hm-privacy",
  templateUrl: "./privacy.component.html",
  styleUrls: ["./privacy.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById("top");
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
}
