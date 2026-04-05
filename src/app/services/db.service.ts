import {Injectable, NgZone, inject} from '@angular/core';
import {User} from "../../shared/interfaces/user.model";
import {
  DatabaseReference,
  Query,
  QueryConstraint,
  ThenableReference,
  getDatabase,
  onValue,
  push,
  query,
  ref,
  remove,
  set,
  update
} from "firebase/database";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";

/**
 * A generic service for interacting with the Firebase Realtime Database.
 * It handles loading states and provides common CRUD (Create, Read, Update, Delete) operations.
 */
@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db = getDatabase();
  private ngZone = inject(NgZone);
  private _home: string | null = null;

  private objectVal<T>(dbRef: DatabaseReference | Query): Observable<T | null> {
    return new Observable<T | null>((subscriber) => {
      const unsubscribe = onValue(
        dbRef,
        (snapshot) => this.ngZone.run(() => subscriber.next(snapshot.val() as T | null)),
        (error) => this.ngZone.run(() => subscriber.error(error))
      );
      return () => unsubscribe();
    });
  }

  private listVal<T>(dbRef: DatabaseReference | Query, options?: { keyField?: string }): Observable<T[]> {
    return new Observable<T[]>((subscriber) => {
      const unsubscribe = onValue(
        dbRef,
        (snapshot) => this.ngZone.run(() => {
          const items: T[] = [];
          snapshot.forEach((child) => {
            const item = child.val() as T;
            if (options?.keyField) {
              (item as unknown as Record<string, unknown>)[options.keyField] = child.key;
            }
            items.push(item);
          });
          subscriber.next(items);
        }),
        (error) => this.ngZone.run(() => subscriber.error(error))
      );
      return () => unsubscribe();
    });
  }

  /**
   * Gets the current user's home ID from local storage.
   * The value is cached after the first read for efficiency.
   * @returns The home ID string, or an empty string if not found or not yet read.
   */
  get home(): string {
    if (this._home) return this._home;
    const userItem = localStorage.getItem('user');
    if (!userItem) return '';
    try {
      const home = (JSON.parse(userItem) as User).home;
      this._home = home ? home : '';
    } catch {
      this._home = '';
    }
    return this._home;
  }

  /**
   * Creates or overwrites data at a specified path in the database.
   * @param path The path to the data.
   * @param object The data to be stored.
   * @returns A promise that resolves when the write is complete.
   * @template T The type of the object being created.
   */
  async create<T>(path: string, object: T): Promise<void> {
    try {
      return await set(ref(this.db, path), object);
    } catch (error) {
      console.error(`Error creating data at path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Reads a single object from the database as an Observable.
   * @param path The path to the object.
   * @returns An Observable that emits the object value, or null if it doesn't exist.
   * @template T The expected type of the object.
   */
  public read<T>(path: string): Observable<T | null> {
    return this.objectVal<T>(ref(this.db, path)).pipe(
      catchError(error => {
        console.error(`Error reading data at path: ${path}`, error);
        return of(null);
      })
    );
  }

  /**
   * Reads a list of objects from the database as an Observable.
   * The 'id' property is automatically added to each object from its key.
   * @param path The path to the list.
   * @returns An Observable that emits an array of objects.
   * @template T The expected type of objects in the list.
   */
  public readList<T>(path: string): Observable<T[]> {
    return this.listVal<T>(ref(this.db, path), { keyField: 'id' }).pipe(
      catchError(error => {
        console.error(`Error reading list at path: ${path}`, error);
        return of([] as T[]);
      })
    );
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
    return this.listVal<T>(q, { keyField: 'id' }).pipe(
      catchError(error => {
        console.error(`Error reading filtered list at path: ${path}`, error);
        return of([] as T[]);
      })
    );
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
    try {
      return await update(ref(this.db, path), object);
    } catch (error) {
      console.error(`Error updating data at path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Deletes data at a specified path.
   * @param path The path to the data to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  public async delete(path: string): Promise<void> {
    try {
      return await remove(ref(this.db, path));
    } catch (error) {
      console.error(`Error deleting data at path: ${path}`, error);
      throw error;
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
    return push(ref(this.db, path), object); // push does not need the db instance directly
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
    try {
      await update(ref(this.db, `${path}/${key}`), object);
    } catch (error) {
      console.error(`Error updating list value at path: ${path}/${key}`, error);
      throw error;
    }
  }

  /**
   * Deletes a specific value from a list using its key.
   * @param path The path to the list.
   * @param key The unique key of the value to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  public async deleteListValue(path: string, key: string): Promise<void> {
    try {
      await remove(ref(this.db, `${path}/${key}`));
    } catch (error) {
      console.error(`Error deleting list value at path: ${path}/${key}`, error);
      throw error;
    }
  }

}
