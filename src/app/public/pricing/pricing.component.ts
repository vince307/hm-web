import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { PublicService } from "@app/public/public.service";

@Component({
  selector: "hm-pricing",
  templateUrl: "./pricing.component.html",
  styleUrls: ["./pricing.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingComponent implements OnInit {
  constructor(private publicService: PublicService) {}

  ngOnInit() {
    this.publicService.validateUserNoRedirect();
  }
}
