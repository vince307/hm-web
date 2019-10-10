import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "@app/core";
import { PublicService } from "@app/public/public.service";
import { DataService } from "./../admin.data.service";
import * as fromRoot from "@app/app.reducer";
import { NgxMasonryComponent } from "ngx-masonry";
import { AdminService } from "@app/admin/admin.service";
import { AUTH_KEY, hm_api } from "@app/shared/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { ScrollDispatcher } from "@angular/cdk/scrolling";
import { MatDialog, MatSidenav, MatSidenavContainer } from "@angular/material";
import { MailItemsSuccessModalComponent } from "@app/admin/gallery/mail-items-success-modal.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UIService } from "@app/shared/ui.service";
import { MailItemsMainModalComponent } from "@app/admin/gallery/mail-items-main-modal.component";
import { MailItemsErrorModalComponent } from "@app/admin/gallery/mail-items-error-modal.component";

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
    public dialog: MatDialog,
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
  sendingEmailWithItems = false;
  selectedImagesSize = 0;
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

    this.fetchGalleryData("s", this.fileType, this.imageOffsetStart);
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
        this.fetchGalleryData("s", this.fileType, this.videoOffsetStart);
      }
      this.onClickVideos();
    } else {
      this.fileType = "image";
      if (this.masonryImagesItems.length === 0) {
        this.fetchGalleryData("s", this.fileType, this.imageOffsetStart);
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
        // console.log(this.moreVideosBtn)
      } else {
        limit = this.masonryVideosItems.length + this.videoOffsetStart;
        this.moreVideosBtn = true;
        // console.log(this.moreVideosBtn)
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

  doStuff(event) {
    this.refreshMasonry();
  }

  doOtherStuff(event) {
    this.refreshMasonry();
  }

  adminActionsModal() {
    this.closeOptionsSideNav();
  }

  closeOptionsSideNav() {
    this.sidenav.toggle().then(res => {
      this.isOptionsOpen = res;
    });
  }

  optionRemoveItem(state) {
    this.isOptionRemove = !state;
    this.isOptionSelect = false;
    this.isOptionRemoveItemModel = true;
    this.isOptionSelectItemModel = !this.isOptionRemoveItemModel;
    this.closeOptionsSideNav();
  }

  selectItem(fileType, itemId, index) {
    if (fileType === "image") {
      if (this.masonryImagesItems[index]["select"]) {
        this.masonryImagesItems[index]["select"] = !this.masonryImagesItems[
          index
        ]["select"];
        this.selectedImagesSize -= parseInt(
          this.masonryImagesItems[index]["fFileSize"],
          10
        );
        return false;
      }
      if (this.selectedImagesSize > 10000000) {
        this.uiService.showSnackbar(
          "You have reached email max size limit.",
          null,
          3000
        );
        return false;
      }
      this.selectedImagesSize += parseInt(
        this.masonryImagesItems[index]["fFileSize"],
        10
      );
      this.masonryImagesItems[index]["select"] = !this.masonryImagesItems[
        index
      ]["select"];
    } else {
      this.masonryVideosItems[index]["select"] = !this.masonryVideosItems[
        index
      ]["select"];
    }
  }

  sendEmailWithItems() {
    let itemListEmpty = false;
    this.masonryImagesItems.forEach(item => {
      if (item.select) {
        itemListEmpty = true;
      }
    });
    if (!itemListEmpty) {
      this.uiService.showSnackbar(
        "Please select images you wish to email before continuing.",
        null,
        3000
      );
      return false;
    }

    const dialogRef = this.dialog.open(MailItemsMainModalComponent, {
      height: "400px",
      width: "600px",
      hasBackdrop: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const itemList = [];
        this.masonryImagesItems.forEach(item => {
          if (item.select) {
            itemList.push(item.itemId);
          }
        });
        this.sendEmailWithItemsHttp(itemList, result.list, result.message);
      }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  sendEmailWithItemsHttp(itemList, emailList, message) {
    this.sendingEmailWithItems = true;
    (async () => {
      try {
        await this.publicService.validateUser();

        const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
        if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
          this.cookieValue = this.cookieService.get(AUTH_KEY);
          const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "x-access-token": this.cookieValue
          });
          const options = { headers: headers };
          const body = JSON.stringify({
            itemList: itemList,
            emailList: emailList,
            message: message
          });
          await this.http.post(hm_api + "admin/mail", body, options).subscribe(
            res => {
              this.sendingEmailWithItems = false;
              this.isOptionSelect = false;
              this.isOptionSelectItemModel = false;
              this.masonryImagesItems.forEach(item => {
                item.select = false;
              });
              this.selectedImagesSize = 0;
              const dialogRef = this.dialog.open(
                MailItemsSuccessModalComponent,
                {
                  width: "600px",
                  hasBackdrop: true,
                  disableClose: true
                }
              );
            },
            err => {
              this.sendingEmailWithItems = false;
              this.isOptionSelect = false;
              this.isOptionSelectItemModel = false;
              this.masonryImagesItems.forEach(item => {
                item.select = false;
              });
              this.selectedImagesSize = 0;
              const dialogRef = this.dialog.open(MailItemsErrorModalComponent, {
                width: "600px",
                hasBackdrop: true,
                disableClose: true
              });
              // this.uiService.showSnackbar(
              //   'Your request can\'t be processed at the moment, please try again later',
              //   null,
              //   3000
              // );
            },
            () => {
              this.sendingEmailWithItems = false;
              this.isOptionSelectItemModel = false;
            }
          );
        } else {
          this.sendingEmailWithItems = false;
          this.isOptionSelectItemModel = false;
          this.uiService.showSnackbar(
            "No token provided. Can't authenticate.",
            null,
            3000
          );
        }
      } catch (e) {
        // handle errors as needed
      }
    })();
  }

  removeItem(fileType, itemId, index) {
    let currentItem;
    if (fileType === "image") {
      currentItem = this.masonryImagesItems[index];
      this.masonryImagesItems = this.masonryImagesItems.filter(
        item => item.itemId !== itemId
      );
    } else {
      currentItem = this.masonryVideosItems[index];
      this.masonryVideosItems = this.masonryVideosItems.filter(
        item => item.itemId !== itemId
      );
    }

    (async () => {
      try {
        await this.publicService.validateUser();

        const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
        if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
          this.cookieValue = this.cookieService.get(AUTH_KEY);
          const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "x-access-token": this.cookieValue
          });
          const options = { headers: headers };
          await this.http
            .delete(hm_api + "admin/delete/" + itemId, options)
            .subscribe(
              respond => {
                if (respond && respond["message"] === "success") {
                  this.uiService.showSnackbar(
                    "Splendid! Item removed.",
                    null,
                    1000
                  );
                }
              },
              err => {
                // add sorting by date when item is added back again when there is server side error
                if (fileType === "image") {
                  this.masonryImagesItems.push(currentItem);
                  this.masonryImagesItems.sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  );
                } else {
                  this.masonryVideosItems.push(currentItem);
                  this.masonryVideosItems.sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  );
                }

                this.uiService.showSnackbar(
                  "Your request can't be processed at the moment, please try again later",
                  null,
                  2000
                );
              },
              () => {
                // this.store.dispatch(new Public.GetMailUriProcess(null));
              }
            );
        } else {
          // add sorting by date when item is added back again when there is server side error
          if (fileType === "image") {
            this.masonryImagesItems.push(currentItem);
            this.masonryImagesItems.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          } else {
            this.masonryVideosItems.push(currentItem);
            this.masonryVideosItems.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          }

          this.uiService.showSnackbar(
            "No token provided. Can't authenticate.",
            null,
            2000
          );
        }
      } catch (e) {
        // handle errors as needed
      }
    })();
  }

  optionSelectItem(state) {
    this.isOptionSelect = !state;
    this.isOptionRemove = false;
    this.isOptionSelectItemModel = true;
    this.isOptionRemoveItemModel = !this.isOptionSelectItemModel;
    this.closeOptionsSideNav();
  }

  fetchGalleryData(token: string, fileType: string, offset: number) {
    this.isLoadingData = true;

    // console.log('fetchGalleryData');

    (async () => {
      try {
        await this.publicService.validateUser();

        const cookieExists: boolean = this.cookieService.check(AUTH_KEY);
        if (cookieExists && this.cookieService.get(AUTH_KEY) !== null) {
          this.cookieValue = this.cookieService.get(AUTH_KEY);
          const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "x-access-token": this.cookieValue
          });
          const options = { headers: headers };
          await this.http
            .get(
              hm_api + "admin/gallery/" + token + "/" + fileType + "/" + offset,
              options
            )
            .subscribe(
              respond => {
                if (respond && respond["data"]) {
                  if (this.fileType === "image") {
                    this.moreImagesBtn = true;
                    this.imagesAllItems = respond["data"]["items"];
                    let limit = this.imageOffsetStart;
                    if (respond["data"]["total"] < this.imageOffset) {
                      limit = respond["data"]["total"];
                      this.moreImagesBtn = false;
                    } else {
                      this.moreImagesBtn = true;
                    }
                    for (let i = 0; i < limit; i++) {
                      respond["data"]["items"][i]["select"] = false;
                      respond["data"]["items"][i]["urlSmall"] =
                        hm_api +
                        "admin/image/" +
                        respond["data"]["items"][i].dirForwardSlash +
                        respond["data"]["items"][i].subDirForwardSlash +
                        respond["data"]["items"][i].fFilenameThumb +
                        "/thumb";
                      respond["data"]["items"][i]["urlBig"] =
                        hm_api +
                        "admin/image/" +
                        respond["data"]["items"][i].dirForwardSlash +
                        respond["data"]["items"][i].subDirForwardSlash +
                        respond["data"]["items"][i].fFilename;
                      this.masonryImagesItems.push(respond["data"]["items"][i]);
                    }
                  } else {
                    this.moreVideosBtn = true;
                    this.videosAllItems = respond["data"]["items"];
                    let limit = this.videoOffsetStart;
                    if (respond["data"]["total"] < this.videoOffset) {
                      limit = respond["data"]["total"];
                      this.moreVideosBtn = false;
                    } else {
                      this.moreVideosBtn = true;
                    }
                    for (let i = 0; i < limit; i++) {
                      respond["data"]["items"][i]["select"] = false;
                      respond["data"]["items"][i]["urlSmall"] =
                        hm_api +
                        "admin/image/" +
                        respond["data"]["items"][i].dirForwardSlash +
                        respond["data"]["items"][i].subDirForwardSlash +
                        respond["data"]["items"][i].fFilenameThumb +
                        "/thumb";
                      respond["data"]["items"][i]["src"] =
                        hm_api +
                        "admin/video/" +
                        respond["data"]["items"][i].dirForwardSlash +
                        respond["data"]["items"][i].subDirForwardSlash +
                        respond["data"]["items"][i].fFilename;
                      this.masonryVideosItems.push(respond["data"]["items"][i]);
                    }
                  }
                  this.refreshMasonry();
                  this.isLoadingData = false;
                }
              },
              err => {
                this.isLoadingData = false;
              },
              () => {
                // this.store.dispatch(new Public.GetMailUriProcess(null));
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
              }
            );
        } else {
          this.isLoadingData = false;
        }
      } catch (e) {
        // handle errors as needed
        this.isLoadingData = false;
      }
    })();
  }
}
