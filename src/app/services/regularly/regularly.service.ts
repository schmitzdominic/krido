import { Injectable, inject } from '@angular/core';
import {DbService} from "../db.service";
import {Regularly} from "../../../shared/interfaces/regularly.model";
import {RegularlyCycleType} from "../../../shared/enums/regularly-cycle-type.enum";
import {equalTo, orderByChild} from "firebase/database";

@Injectable({
  providedIn: 'root'
})
export class RegularlyService {
  private dbService = inject(DbService);

  private get rootPath(): string { return `homes/${this.dbService.home}/regular`; }

  constructor() { }

  addRegularly(regularly: Regularly) {
    return this.dbService.createListValue(`${this.rootPath}`, regularly);
  }

  getAllByCycleType(cycleType: RegularlyCycleType) {
    return this.dbService.readFilteredList(`${this.rootPath}`, orderByChild('cycle'), equalTo(cycleType));
  }

  updateRegularly(regularly: Regularly, key: string) {
    return this.dbService.updateListValue(`${this.rootPath}`, key, regularly);
  }

  deleteRegularly(key: string) {
    return this.dbService.delete(`${this.rootPath}/${key}`);
  }
}
