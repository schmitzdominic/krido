import {inject, Injectable} from '@angular/core';
import {LoadingService} from './loading/loading.service';
import {User} from "../../shared/interfaces/user.model";
import {
  Database,
  listVal,
  objectVal,
  push,
  query,
  QueryConstraint,
  ref,
  remove,
  set,
  update, ThenableReference
} from "@angular/fire/database";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db: Database = inject(Database);
  private loadingService = inject(LoadingService);

  get home(): string {
    const userItem = localStorage.getItem('user');
    if (!userItem) return '';
    const home = (JSON.parse(userItem) as User).home;
    return home ? home : '';
  }

  async create<T>(path: string, object: T): Promise<void> {
    this.loadingService.setLoading = true;
    try {
      return await set(ref(this.db, path), object);
    } catch (error) {
      console.error(`Error creating data at path: ${path}`, error);
      throw error; // Re-throw the error to be handled by the caller
    } finally {
      this.loadingService.setLoading = false;
    }
  }

  read<T>(path: string): Observable<T | null> {
    return objectVal<T>(ref(this.db, path));
  }

  readList<T>(path: string): Observable<T[]> {
    // The 'id' will be automatically added to the object when using listVal with keyField.
    return listVal<T>(ref(this.db, path), { keyField: 'id' });
  }

  readFilteredList<T>(path: string, ...constraints: QueryConstraint[]): Observable<T[]> {
    const q = query(ref(this.db, path), ...constraints);
    return listVal<T>(q, { keyField: 'id' });
  }

  async update<T extends object>(path: string, object: Partial<T>, loading: boolean = true): Promise<void> {
    if (loading) this.loadingService.setLoading = true;
    try {
      return await update(ref(this.db, path), object);
    } catch (error) {
      console.error(`Error updating data at path: ${path}`, error);
      throw error;
    } finally {
      if (loading) this.loadingService.setLoading = false;
    }
  }

  async delete(path: string): Promise<void> {
    this.loadingService.setLoading = true;
    try {
      return await remove(ref(this.db, path));
    } catch (error) {
      console.error(`Error deleting data at path: ${path}`, error);
      throw error;
    } finally {
      this.loadingService.setLoading = false;
    }
  }

  createListValue<T>(path: string, object: T): ThenableReference {
    // This returns a "ThenableReference", which has a `key` property and can be awaited.
    return push(ref(this.db, path), object);
  }

  async updateListValue<T extends object>(path: string, key: string, object: Partial<T>, loading: boolean = true): Promise<void> {
    if (loading) this.loadingService.setLoading = true;
    try {
      return await update(ref(this.db, `${path}/${key}`), object);
    } finally {
      if (loading) this.loadingService.setLoading = false;
    }
  }

  async deleteListValue(path: string, key: string): Promise<void> {
    this.loadingService.setLoading = true;
    try {
      return await remove(ref(this.db, `${path}/${key}`));
    } finally {
      this.loadingService.setLoading = false;
    }
  }

}
