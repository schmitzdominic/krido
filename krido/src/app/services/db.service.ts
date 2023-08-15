import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {LoadingService} from "./loading/loading.service";

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private db: AngularFireDatabase,
              private loadingService: LoadingService) {
  }

  create(path: string, object: any): Promise<void> {
    this.loadingService.setLoading = true;
    return this.db.object(path).set(object).finally(() => {this.loadingService.setLoading = false;});
  }

  read(path: string) {
    return this.db.object(path).snapshotChanges();
  }

  readList(path: string) {
    return this.db.list(path).snapshotChanges();
  }

  update(path: string, object: any): Promise<void> {
    this.loadingService.setLoading = true;
    return this.db.object(path).update(object).finally(() => {this.loadingService.setLoading = false;});
  }

  delete(path: string): Promise<void> {
    this.loadingService.setLoading = true;
    return this.db.object(path).remove().finally(() => {this.loadingService.setLoading = false;});
  }

  createList(path: string, object: any) {
    return this.db.list(path).push(object);
  }

  updateList(path: string, key: string, object: any) {
    this.loadingService.setLoading = true;
    return this.db.list(path).set(key, object).finally(() => {this.loadingService.setLoading = false;});
  }

  deleteList(path: string) {
    this.loadingService.setLoading = true;
    return this.db.list(path).remove().finally(() => {this.loadingService.setLoading = false;});
  }

  updateListValue(path: string, key: string, object: any) {
    this.loadingService.setLoading = true;
    return this.db.list(path).update(key, object).finally(() => {this.loadingService.setLoading = false;});
  }

  deleteListValue(path: string, key: string) {
    this.loadingService.setLoading = true;
    return this.db.list(path).remove(key).finally(() => {this.loadingService.setLoading = false;});
  }
}
