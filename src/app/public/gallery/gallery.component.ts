import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "@app/core";
import { PublicService } from "@app/public/public.service";
import { DataService } from "@app/admin/admin.data.service";
import { AdminService } from "@app/admin/admin.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { ScrollDispatcher } from "@angular/cdk/overlay";
import { MatDialog, MatSidenav } from "@angular/material";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UIService } from "@app/shared/ui.service";
import { Observable } from "rxjs";
import { NgxMasonryComponent } from "ngx-masonry";
import * as fromRoot from "@app/app.reducer";
import { hm_api } from "@app/shared/globals";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "hm-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private publicService: PublicService,
    private dataService: DataService,
    private adminService: AdminService,
    private http: HttpClient,
    private cookieService: CookieService,
    private scrollDispatcher: ScrollDispatcher,
    private route: ActivatedRoute,
    fb: FormBuilder,
    private uiService: UIService
  ) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
  }

  isLoading$: Observable<boolean>;
  collectionId: string;
  cookieValue = "UNKNOWN";
  offset = 5;
  videoOffset = 5;
  videoOffsetStart = 5;
  imageOffset = 30;
  imageOffsetStart = 30;
  fileType = "image";
  masonryImagesItems = [];
  imagesAllItems = [];
  masonryVideosItems = [];
  videosAllItems = [];
  isLoadingData = false;
  isAddingItems = false;
  options: FormGroup;
  isOptionRemoveItemModel = false;
  isOptionSelectItemModel = false;
  isOptionsOpen = "close";
  isOptionRemove = false;
  isOptionSelect = false;
  resultsErrorLoading = false;
  resultsErrorToken = false;
  sendingEmailWithItems = false;
  isResultsEmpty = false;
  moreImagesBtn = true;
  moreVideosBtn = true;
  @ViewChild("masonryImages")
  masonryImg: NgxMasonryComponent;
  @ViewChild("masonryVideos")
  masonryVid: NgxMasonryComponent;
  @ViewChild("refreshBtn")
  refreshBtn: ElementRef<HTMLElement>;
  @ViewChild("imagesWrapper")
  imagesWrapper: ElementRef;
  @ViewChild("videosWrapper")
  videosWrapper: ElementRef;
  @ViewChild("sidenav")
  sidenav: MatSidenav;

  public myOptions: any = {
    transitionDuration: "0.8s",
    originLeft: true,
    fitWidth: true,
    gutter: 20
  };

  ngOnInit() {
    this.dataService.currentCollectionId.subscribe(
      collectionId => (this.collectionId = collectionId)
    );
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.scrollDispatcher.scrolled().subscribe(x => {});

    this.fetchGalleryData(
      this.route.snapshot.params.uri,
      this.fileType,
      this.imageOffsetStart
    );
  }

  onClickImages() {
    this.masonryImg.layout();
    this.masonryImg.reloadItems();
  }

  onClickVideos() {
    this.masonryVid.layout();
    this.masonryVid.reloadItems();
  }

  tabClick(event) {
    if (event.tab.textLabel === "Videos") {
      this.fileType = "video";
      if (this.masonryVideosItems.length === 0) {
        this.fetchGalleryData(
          this.route.snapshot.params.uri,
          this.fileType,
          this.videoOffsetStart
        );
      }
      this.onClickVideos();
    } else {
      this.fileType = "image";
      if (this.masonryImagesItems.length === 0) {
        this.fetchGalleryData(
          this.route.snapshot.params.uri,
          this.fileType,
          this.imageOffsetStart
        );
      }
      this.onClickImages();
    }
    this.refreshMasonry();
  }

  refreshMasonry() {
    // below need to executed when new items will be added to masonry item array
    const el: HTMLElement = this.refreshBtn.nativeElement;
    el.click();
  }

  doStuff(event) {
    this.refreshMasonry();
  }

  doOtherStuff(event) {
    this.refreshMasonry();
  }

  moreImages() {
    this.moreImagesBtn = false;
    if (
      !this.isAddingItems &&
      this.imagesAllItems.length > this.masonryImagesItems.length
    ) {
      this.isAddingItems = true;
      this.isLoadingData = true;
      // add images
      let limit = this.imageOffset;
      if (
        this.imagesAllItems.length <
        this.masonryImagesItems.length + this.imageOffsetStart
      ) {
        limit = this.imagesAllItems.length;
        this.moreImagesBtn = false;
      } else {
        limit = this.masonryImagesItems.length + this.imageOffsetStart;
        this.moreImagesBtn = true;
      }
      for (let i = this.masonryImagesItems.length; i < limit; i++) {
        this.imagesAllItems[i]["urlSmall"] =
          hm_api +
          "admin/image/" +
          this.imagesAllItems[i].dirForwardSlash +
          this.imagesAllItems[i].subDirForwardSlash +
          this.imagesAllItems[i].fFilenameThumb +
          "/thumb";
        this.imagesAllItems[i]["urlBig"] =
          hm_api +
          "admin/image/" +
          this.imagesAllItems[i].dirForwardSlash +
          this.imagesAllItems[i].subDirForwardSlash +
          this.imagesAllItems[i].fFilename;
        this.masonryImagesItems.push(this.imagesAllItems[i]);
      }
      this.imageOffset += this.imageOffsetStart;
      this.isAddingItems = false;
      this.isLoadingData = false;
    }
  }

  moreVideos() {
    this.moreVideosBtn = false;
    if (
      !this.isAddingItems &&
      this.videosAllItems.length > this.masonryVideosItems.length
    ) {
      this.isAddingItems = true;
      this.isLoadingData = true;
      // add images
      let limit = this.videoOffset;
      if (
        this.videosAllItems.length <
        this.masonryVideosItems.length + this.videoOffsetStart
      ) {
        limit = this.videosAllItems.length;
        this.moreVideosBtn = false;
      } else {
        limit = this.masonryVideosItems.length + this.videoOffsetStart;
        this.moreVideosBtn = true;
      }
      for (let i = this.masonryVideosItems.length; i < limit; i++) {
        this.videosAllItems[i]["urlSmall"] =
          hm_api +
          "image/" +
          this.videosAllItems[i].dirForwardSlash +
          this.videosAllItems[i].subDirForwardSlash +
          this.videosAllItems[i].fFilenameThumb +
          "/thumb";
        this.videosAllItems[i]["src"] =
          hm_api +
          "video/" +
          this.videosAllItems[i].dirForwardSlash +
          this.videosAllItems[i].subDirForwardSlash +
          this.videosAllItems[i].fFilename;
        this.masonryVideosItems.push(this.videosAllItems[i]);
      }
      this.videosAllItems.length === this.masonryVideosItems.length
        ? (this.moreVideosBtn = false)
        : (this.moreVideosBtn = true);
      this.videoOffset += this.videoOffsetStart;
      this.isAddingItems = false;
      this.isLoadingData = false;
    }
  }

  fetchGalleryData(token: string, fileType: string, offset: number) {
    if (token && token.length === 13) {
      this.isLoadingData = true;

      (async () => {
        try {
          const headers = new HttpHeaders({
            "Content-Type": "application/json"
          });
          const options = { headers: headers };
          await this.http
            .get(hm_api + "gallery/" + token + "/" + fileType, options)
            .subscribe(
              respond => {
                if (respond && respond["data"]) {
                  if (this.fileType === "image") {
                    this.moreImagesBtn = true;
                    this.imagesAllItems = respond["data"];
                    let limit = this.imageOffsetStart;
                    if (respond["data"]["total"] < this.imageOffset) {
                      limit = respond["data"]["total"];
                      this.moreImagesBtn = false;
                    } else {
                      this.moreImagesBtn = true;
                    }
                    for (let i = 0; i < limit; i++) {
                      // respond['data'][i]['select'] = false;
                      respond["data"][i]["urlSmall"] =
                        hm_api +
                        "admin/image/" +
                        respond["data"][i].dirForwardSlash +
                        respond["data"][i].subDirForwardSlash +
                        respond["data"][i].fFilenameThumb +
                        "/thumb";
                      respond["data"][i]["urlBig"] =
                        hm_api +
                        "admin/image/" +
                        respond["data"][i].dirForwardSlash +
                        respond["data"][i].subDirForwardSlash +
                        respond["data"][i].fFilename;
                      this.masonryImagesItems.push(respond["data"][i]);
                    }
                  } else {
                    this.moreVideosBtn = true;
                    this.videosAllItems = respond["data"];
                    let limit = this.videoOffsetStart;
                    if (respond["data"]["total"] < this.videoOffset) {
                      limit = respond["data"]["total"];
                      this.moreVideosBtn = false;
                    } else {
                      this.moreVideosBtn = true;
                    }
                    for (let i = 0; i < limit; i++) {
                      // respond['data'][i]['select'] = false;
                      respond["data"][i]["urlSmall"] =
                        hm_api +
                        "admin/image/" +
                        respond["data"][i].dirForwardSlash +
                        respond["data"][i].subDirForwardSlash +
                        respond["data"][i].fFilenameThumb +
                        "/thumb";
                      respond["data"][i]["src"] =
                        hm_api +
                        "admin/video/" +
                        respond["data"][i].dirForwardSlash +
                        respond["data"][i].subDirForwardSlash +
                        respond["data"][i].fFilename;
                      this.masonryVideosItems.push(respond["data"][i]);
                    }
                  }
                  this.refreshMasonry();
                  this.isLoadingData = false;
                }
              },
              err => {
                // console.log('err: ', err.status);
                if (err.status && err.status === 409) {
                  this.isLoadingData = false;
                  this.resultsErrorToken = false;
                  this.resultsErrorLoading = false;
                  this.isResultsEmpty = true;
                  this.refreshMasonry();
                } else {
                  this.resultsErrorLoading = true;
                  this.uiService.showSnackbar(
                    "Your request can't be processed at the moment, please try again later",
                    null,
                    3000
                  );
                  this.isLoadingData = false;
                }
              },
              () => {
                if (
                  this.fileType === "image" &&
                  !this.masonryImagesItems.length
                ) {
                  setTimeout(() => {
                    this.fetchGalleryData("s", this.fileType, this.offset);
                  }, 1000);
                } else if (
                  this.fileType === "video" &&
                  !this.masonryVideosItems.length
                ) {
                  setTimeout(() => {
                    this.fetchGalleryData("s", this.fileType, this.offset);
                  }, 1000);
                }
                this.isLoadingData = false;
              }
            );
        } catch (e) {
          // handle errors as needed
          this.isLoadingData = false;
        }
      })();
    } else {
      this.resultsErrorToken = true;
    }
  }
}
