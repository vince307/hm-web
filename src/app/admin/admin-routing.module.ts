import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashComponent } from "@app/admin/dash/dash.component";
import { GalleryComponent } from "@app/admin/gallery/gallery.component";
import { UploadComponent } from "@app/admin/upload/upload.component";
import { PaymentComponent } from "@app/admin/payment/payment.component";

const routes: Routes = [
  {
    path: "",
    // component: AdminComponent,
    children: [
      {
        path: "dash",
        component: DashComponent,
        data: { title: "hm.admin.menu.dash" }
      },
      {
        path: "gallery",
        component: GalleryComponent,
        data: { title: "hm.admin.menu.gallery" }
      },
      {
        path: "upload",
        component: UploadComponent,
        data: { title: "hm.admin.menu.upload" }
      },
      {
        path: "payment",
        component: PaymentComponent,
        data: { title: "hm.admin.menu.payment" }
      },
      {
        path: "payment/:action/:type",
        component: PaymentComponent,
        pathMatch: "full",
        data: { title: "hm.admin.menu.payment" }
      },
      {
        path: "**",
        redirectTo: "signin"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
