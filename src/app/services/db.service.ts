import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {LoadingService} from "./loading/loading.service";
import {User} from "../../shared/interfaces/user.model";
import {QueryFn} from "@angular/fire/compat/database/interfaces";

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private db: AngularFireDatabase,
              private loadingService: LoadingService) {
  }

  get home(): string {
    const home = (JSON.parse(localStorage.getItem('user')!) as User).home;
    return home ? home : '';
  }

  async create(path: string, object: any): Promise<void> {
    this.loadingService.setLoading = true;
    try {
      return await this.db.object(path).set(object);
    } finally {
      this.loadingService.setLoading = false;
    }
  }

  read(path: string) {
    return this.db.object(path).snapshotChanges();
  }

  readList(path: string) {
    return this.db.list(path).snapshotChanges();
  }

  readFilteredList(path: string, queryFn?: QueryFn) {
    return this.db.list(path, queryFn).snapshotChanges();
  }

  async update(path: string, object: any, loading: boolean = true): Promise<void> {
    this.loadingService.setLoading = loading;
    try {
      return await this.db.object(path).update(object);
    } finally {
      this.loadingService.setLoading = false;
    }
  }

  async updateNoLoading(path: string, object: any) {
    try {
      return await this.db.object(path).update(object);
    } finally {
      this.loadingService.setLoading = false;
    }
  }

  async delete(path: string): Promise<void> {
    this.loadingService.setLoading = true;
    try {
      return await this.db.object(path).remove();
    } finally {
      this.loadingService.setLoading = false;
    }
  }

  async updateList(path: string, key: string, object: any) {
    this.loadingService.setLoading = true;
    try {
      return await this.db.list(path).set(key, object);
    } finally {
      this.loadingService.setLoading = false;
    }
  }

  async deleteList(path: string) {
    this.loadingService.setLoading = true;
    try {
      return await this.db.list(path).remove();
    } finally {
      this.loadingService.setLoading = false;
    }
  }

  createListValue(path: string, object: any) {
    return this.db.list(path).push(object);
  }

  async updateListValue(path: string, key: string, object: any, loading: boolean = true) {
    this.loadingService.setLoading = loading;
    try {
      return await this.db.list(path).update(key, object);
    } finally {
      this.loadingService.setLoading = false;
    }
  }

  async deleteListValue(path: string, key: string) {
    this.loadingService.setLoading = true;
    try {
      return await this.db.list(path).remove(key);
    } finally {
      this.loadingService.setLoading = false;
    }
  }
}
