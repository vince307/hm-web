import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private collectionIdSource = new BehaviorSubject(null);
  currentCollectionId = this.collectionIdSource.asObservable();

  constructor() {}

  changeCollectionId(id: string) {
    this.collectionIdSource.next(id);
  }
}
