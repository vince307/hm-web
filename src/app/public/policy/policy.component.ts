import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hm-policy",
  templateUrl: "./policy.component.html",
  styleUrls: ["./policy.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolicyComponent implements OnInit {
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
