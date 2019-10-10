import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared";
import { StoreModule } from "@ngrx/store";
import { DashComponent } from "./dash/dash.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { UploadComponent } from "./upload/upload.component";
import { AdminRoutingModule } from "@app/admin/admin-routing.module";
import { adminReducer } from "@app/admin/admin.reducer";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { ClipboardModule } from "ngx-clipboard";
import { FilePondModule, registerPlugin } from "ngx-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileMetadata from "filepond-plugin-file-metadata";
import { NgxMasonryModule } from "ngx-masonry";
import * as FilePond from "filepond";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AdminInterceptor } from "@app/admin/admin.interceptor";
import { DashModalComponent } from "@app/admin/dash/dash-modal.component";
// Register the plugin
FilePond.registerPlugin(FilePondPluginFileValidateSize);
FilePond.registerPlugin(FilePondPluginFileValidateType);
FilePond.registerPlugin(FilePondPluginFilePoster);
FilePond.registerPlugin(FilePondPluginImagePreview);
FilePond.registerPlugin(FilePondPluginFileMetadata);
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ScrollEventModule } from "ngx-scroll-event";
import { MailItemsSuccessModalComponent } from "@app/admin/gallery/mail-items-success-modal.component";
import { MailItemsErrorModalComponent } from "@app/admin/gallery/mail-items-error-modal.component";
import { MailItemsMainModalComponent } from "@app/admin/gallery/mail-items-main-modal.component";
import { NgxPayPalModule } from "ngx-paypal";
import { PaymentComponent } from "@app/admin/payment/payment.component";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { environment } from "@env/environment";
import { AngularFireModule } from "@angular/fire";

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    StoreModule.forFeature("admin", adminReducer),
    AngularFontAwesomeModule,
    ClipboardModule,
    FilePondModule, // add filepond module here
    NgxMasonryModule,
    InfiniteScrollModule,
    ScrollEventModule,
    NgxPayPalModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  declarations: [
    DashComponent,
    GalleryComponent,
    UploadComponent,
    DashModalComponent,
    MailItemsSuccessModalComponent,
    MailItemsErrorModalComponent,
    MailItemsMainModalComponent,
    PaymentComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    DashModalComponent,
    MailItemsSuccessModalComponent,
    MailItemsErrorModalComponent,
    MailItemsMainModalComponent
  ]
})
export class AdminModule {}
