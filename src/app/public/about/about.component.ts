import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { PublicService } from "@app/public/public.service";

@Component({
  selector: "hm-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  constructor(private publicService: PublicService) {}

  ngOnInit() {
    this.publicService.validateUserNoRedirect();
  }
}
