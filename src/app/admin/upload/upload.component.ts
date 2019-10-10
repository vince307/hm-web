import { Component, OnInit, ViewChild } from "@angular/core";
import * as fromRoot from "@app/app.reducer";
import { Store } from "@ngrx/store";
import { AppState } from "@app/core";
import { PublicService } from "@app/public/public.service";
import { Observable } from "rxjs";
import { DataService } from "./../admin.data.service";
import { hm_api, AUTH_KEY } from "@app/shared/globals";
import * as FilePond from "filepond";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { CookieService } from "ngx-cookie-service";
import * as fromPublic from "@app/public/public.reducer";

@Component({
  selector: "hm-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.css"]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent implements OnInit {
  isLoading$: Observable<boolean>;
  collectionId: string;
  uploadSuccess = false;
  uploadFailure = false;
  uploadFailureMessage: string;
  uploadProgress = 0;
  uploadProgressString = "0";
  uploadAllItems = 0;
  uploadProcessedItems = 0;
  isUploadingItems = false;
  isHttpFailureMessage$: Observable<any>;
  uploadErrCount = 0;

  @ViewChild("hmPond")
  hmPond: any;

  pondOptions = {
    class: "my-filepond",
    multiple: true,
    labelIdle:
      '<b>Drop files here</b> or click to <span style="text-decoration: underline">Browse</span>',
    acceptedFileTypes: [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "video/mp4",
      "video/3gpp",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv"
    ],
    // allowImagePreview: true
    instantUpload: false,
    maxFiles: 44
  };

  pondFiles = [];

  constructor(
    private store: Store<AppState>,
    private publicService: PublicService,
    private dataService: DataService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.dataService.currentCollectionId.subscribe(
      collectionId => (this.collectionId = collectionId)
    );
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.isHttpFailureMessage$ = this.store.select(fromPublic.getHttpFailure);
    this.isHttpFailureMessage$.subscribe(() => {
      this.filepondError();
    });
    this.publicService.validateUser();

    FilePond.setOptions({
      server: {
        url: hm_api + "upload",
        process: {
          method: "POST",
          withCredentials: false,
          headers: {
            "x-access-token": this.getCookie(),
            "x-collection-id": this.collectionId
          },
          timeout: 2000000,
          onload: null,
          onerror: null,
          ondata: null
        }
      }
    });
    this.uploadFailure = false;
  }

  pondHandleInit() {
    // console.log('FilePond has initialised', this.hmPond);
  }

  pondHandleAddFile(event: any) {
    this.uploadAllItems = this.hmPond.getFiles().length;
  }

  dismissSuccessAlert() {
    this.uploadSuccess = false;
  }

  uploadFiles() {
    this.isUploadingItems = true;
    const allFiles = this.hmPond.getFiles();
    this.uploadAllItems = allFiles.length;

    if (this.uploadAllItems) {
      this.uploadProgressString = "1%";
      this.uploadProgress = 1;
      this.filePondProcessFile(0);
    }
  }

  filePondProcessFile(index) {
    this.hmPond.processFile(index).then((file, err) => {
      this.uploadProcessedItems++;
      const results = JSON.parse(file.serverId);
      // console.log(results);
      if (results.message === "success") {
        this.uploadProgress =
          Math.floor((this.uploadProcessedItems * 100) / this.uploadAllItems) -
          1;
        this.uploadProgressString = this.uploadProgress.toString() + "%";
        if (this.uploadProcessedItems < this.uploadAllItems) {
          this.filePondProcessFile(++index);
        } else if (this.uploadProcessedItems === this.uploadAllItems) {
          this.uploadSuccess = true;
          this.clearFilepond();
        }
        this.uploadErrCount = 0;
      } else {
        this.uploadSuccess = false;
        this.uploadFailure = true;
        this.uploadFailureMessage = results.message;
        this.uploadProgress = 0;
        this.uploadProgressString = this.uploadProgress.toString() + "%";
        this.uploadAllItems = 0;
        this.uploadProcessedItems = 0;
        this.isUploadingItems = false;
        this.uploadErrCount++;
        if (this.uploadErrCount++ < 3) {
          --this.uploadProcessedItems;
          this.filePondProcessFile(index);
        }
      }
    });
  }

  clearFilepond() {
    this.uploadFailure = false;
    this.uploadProgress = 0;
    this.uploadAllItems = 0;
    this.uploadProcessedItems = 0;
    this.isUploadingItems = false;
    this.pondFiles = [];
    this.hmPond.removeFiles();
  }

  filepondError() {
    this.uploadSuccess = false;
    this.uploadFailure = true;
    this.uploadFailureMessage =
      "Sorry, service is unavailable at the moment. Please try again later.";
    this.uploadProgress = 0;
    this.uploadProgressString = this.uploadProgress.toString() + "%";
    this.uploadAllItems = 0;
    this.uploadProcessedItems = 0;
    this.isUploadingItems = false;
  }

  getCookie() {
    const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
    if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
      return this.cookieService.get(AUTH_KEY);
    }
    return null;
  }
}
