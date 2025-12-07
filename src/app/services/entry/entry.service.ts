import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {Entry} from "../../../shared/interfaces/entry.model";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private rootPath: string = `homes/${this.dbService.home}/entries`;

  constructor(private dbService: DbService) { }

  addEntry(entry: Entry) {
    return this.dbService.createListValue(`${this.rootPath}`, entry);
  }

  deleteEntry(key: string) {
    return this.dbService.delete(`${this.rootPath}/${key}`);
  }

  async updateEntry(entry: Entry, key: string) {
    await this.dbService.deleteListValue(`${this.rootPath}`, key);
    return await this.dbService.updateListValue(`${this.rootPath}`, key, entry);
  }

  getAllEntriesByMonthString(monthString: string) {
    return this.dbService.readFilteredList(`${this.rootPath}`, (ref: any) => ref.orderByChild('monthString').equalTo(monthString));
  }

  getAllEntriesByBudgetKey(key: string) {
    return this.dbService.readFilteredList(`${this.rootPath}`, (ref: any) => ref.orderByChild('budgetKey').equalTo(key));
  }

  getAllEntriesByAccountKey(key: string) {
    return this.dbService.readFilteredList(`${this.rootPath}`, (ref: any) => ref.orderByChild('account/key').equalTo(key));
  }

  searchEntriesByName(name: string) {
    return this.dbService.readFilteredList(`${this.rootPath}`, (ref: any) => ref.orderByChild('searchName').startAt(name));
  }

  searchEntriesByMonthString(monthString: string) {
    return this.dbService.readFilteredList(`${this.rootPath}`, (ref: any) => ref.orderByChild('monthString').startAt(monthString));
  }
}
