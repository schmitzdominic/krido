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

  updateEntry(entry: Entry, key: string) {
    return this.dbService.deleteListValue(`${this.rootPath}`, key).then(() => {
      return this.dbService.updateListValue(`${this.rootPath}`, key, entry);
    });
  }

  getAllEntriesByMonthString(monthString: string) {
    return this.dbService.readFilteredList(`${this.rootPath}`, ref => ref.orderByChild('monthString').equalTo(monthString));
  }

  getAllEntriesByBudgetKey(key: string) {
    return this.dbService.readFilteredList(`${this.rootPath}`, ref => ref.orderByChild('budgetKey').equalTo(key));
  }

  getAllEntriesByAccountKey(key: string) {
    return this.dbService.readFilteredList(`${this.rootPath}`, ref => ref.orderByChild('account/key').equalTo(key));
  }
}
