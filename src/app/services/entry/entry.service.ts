import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {Entry} from "../../../shared/interfaces/entry.model";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private rootPath: string =  `homes/${this.dbService.home}/entries`;

  constructor(private dbService: DbService) { }

  addEntry(entry: Entry) {
    return this.dbService.createListValue(`${this.rootPath}`, entry);
  }
}
