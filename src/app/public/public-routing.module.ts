import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "@app/public/home/home.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    data: { title: "hm.menu.home" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
