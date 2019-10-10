import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hm-terms",
  templateUrl: "./terms.component.html",
  styleUrls: ["./terms.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsComponent implements OnInit {
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
