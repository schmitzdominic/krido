import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private db: AngularFireDatabase) { }

  create(path: string, object: any): Promise<void> {
    return this.db.object(path).set(object);
  }

  read(path: string) {
    return this.db.object(path);
  }

  readList(path: string) {
    return this.db.list(path);
  }

  update(path: string, object: any): Promise<void> {
    return this.db.object(path).update(object);
  }

  delete(path: string): Promise<void> {
    return this.db.object(path).remove();
  }

  createList(path: string, object: any) {
    return this.db.list(path).push(object);
  }

  updateList(path: string, key: string, object: any) {
    return this.db.list(path).set(key, object);
  }

  deleteList(path: string) {
    return this.db.list(path).remove();
  }

  updateListValue(path: string, key: string, object: any) {
    return this.db.list(path).update(key, object);
  }

  deleteListValue(path: string, key: string) {
    return this.db.list(path).remove(key);
  }
}
