import { Injectable, inject } from '@angular/core';
import {DbService} from "../db.service";
import {Entry} from "../../../shared/interfaces/entry.model";
import {equalTo, orderByChild, startAt} from "@angular/fire/database";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private dbService = inject(DbService);

  private get rootPath(): string {
    return `homes/${this.dbService.home}/entries`;
  }

  constructor() { }

  addEntry(entry: Entry) {
    return this.dbService.createListValue(`${this.rootPath}`, entry);
  }

  deleteEntry(key: string): Promise<void> {
    return this.dbService.delete(`${this.rootPath}/${key}`);
  }

  async updateEntry(entry: Entry, key: string): Promise<void> {
    await this.dbService.deleteListValue(`${this.rootPath}`, key);
    return await this.dbService.updateListValue(`${this.rootPath}`, key, entry);
  }

  getAllEntriesByMonthString(monthString: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(`${this.rootPath}`, orderByChild('monthString'), equalTo(monthString));
  }

  getAllEntriesByBudgetKey(key: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(`${this.rootPath}`, orderByChild('budgetKey'), equalTo(key));
  }

  getAllEntriesByAccountKey(key: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(`${this.rootPath}`, orderByChild('account/key'), equalTo(key));
  }

  searchEntriesByName(name: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(`${this.rootPath}`, orderByChild('searchName'), startAt(name));
  }

  searchEntriesByMonthString(monthString: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(`${this.rootPath}`, orderByChild('monthString'), startAt(monthString));
  }
}
