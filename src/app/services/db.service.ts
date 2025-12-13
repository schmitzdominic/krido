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

/**
 * A generic service for interacting with the Firebase Realtime Database.
 * It handles loading states and provides common CRUD (Create, Read, Update, Delete) operations.
 */
@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db: Database = inject(Database);
  private loadingService = inject(LoadingService);

  /**
   * Gets the current user's home ID from local storage.
   * @returns The home ID string, or an empty string if not found.
   */
  get home(): string {
    const userItem = localStorage.getItem('user');
    if (!userItem) return '';
    const home = (JSON.parse(userItem) as User).home;
    return home ? home : '';
  }

  /**
   * Creates or overwrites data at a specified path in the database.
   * @param path The path to the data.
   * @param object The data to be stored.
   * @returns A promise that resolves when the write is complete.
   * @template T The type of the object being created.
   */
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

  /**
   * Reads a single object from the database as an Observable.
   * @param path The path to the object.
   * @returns An Observable that emits the object value, or null if it doesn't exist.
   * @template T The expected type of the object.
   */
  public read<T>(path: string): Observable<T | null> {
    return objectVal<T>(ref(this.db, path));
  }

  /**
   * Reads a list of objects from the database as an Observable.
   * The 'id' property is automatically added to each object from its key.
   * @param path The path to the list.
   * @returns An Observable that emits an array of objects.
   * @template T The expected type of objects in the list.
   */
  public readList<T>(path: string): Observable<T[]> {
    // The 'id' will be automatically added to the object when using listVal with keyField.
    return listVal<T>(ref(this.db, path), { keyField: 'id' });
  }

  /**
   * Reads a filtered list of objects from the database based on query constraints.
   * The 'id' property is automatically added to each object from its key.
   * @param path The path to the list.
   * @param constraints A list of Firebase QueryConstraints (e.g., orderByChild, equalTo).
   * @returns An Observable that emits a filtered array of objects.
   * @template T The expected type of objects in the list.
   */
  public readFilteredList<T>(path: string, ...constraints: QueryConstraint[]): Observable<T[]> {
    const q = query(ref(this.db, path), ...constraints);
    return listVal<T>(q, { keyField: 'id' });
  }

  /**
   * Updates parts of an object at a specified path.
   * @param path The path to the object to update.
   * @param object A partial object containing the properties to update.
   * @param loading Whether to show the loading indicator. Defaults to true.
   * @returns A promise that resolves when the update is complete.
   * @template T The type of the object being updated.
   */
  public async update<T extends object>(path: string, object: Partial<T>, loading: boolean = true): Promise<void> {
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

  /**
   * Deletes data at a specified path.
   * @param path The path to the data to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  public async delete(path: string): Promise<void> {
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

  /**
   * Creates a new value in a list at the specified path, generating a unique key.
   * @param path The path to the list.
   * @param object The object to add to the list.
   * @returns A "ThenableReference" which contains the key of the new value and can be awaited.
   * @template T The type of the object being created.
   */
  public createListValue<T>(path: string, object: T): ThenableReference {
    // This returns a "ThenableReference", which has a `key` property and can be awaited.
    return push(ref(this.db, path), object);
  }

  /**
   * Updates a specific value within a list using its key.
   * @param path The path to the list.
   * @param key The unique key of the value to update.
   * @param object A partial object containing the properties to update.
   * @param loading Whether to show the loading indicator. Defaults to true.
   * @returns A promise that resolves when the update is complete.
   * @template T The type of the object being updated.
   */
  public async updateListValue<T extends object>(path: string, key: string, object: Partial<T>, loading: boolean = true): Promise<void> {
    if (loading) this.loadingService.setLoading = true;
    try {
      return await update(ref(this.db, `${path}/${key}`), object);
    } finally {
      if (loading) this.loadingService.setLoading = false;
    }
  }

  /**
   * Deletes a specific value from a list using its key.
   * @param path The path to the list.
   * @param key The unique key of the value to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  public async deleteListValue(path: string, key: string): Promise<void> {
    this.loadingService.setLoading = true;
    try {
      return await remove(ref(this.db, `${path}/${key}`));
    } finally {
      this.loadingService.setLoading = false;
    }
  }

}
