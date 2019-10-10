import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hm-cookie",
  templateUrl: "./cookie.component.html",
  styleUrls: ["./cookie.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookieComponent implements OnInit {
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
