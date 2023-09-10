import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {Regularly} from "../../../shared/interfaces/regularly.model";
import {RegularlyCycleType} from "../../../shared/enums/regularly-cycle-type.enum";

@Injectable({
  providedIn: 'root'
})
export class RegularlyService {

  private rootPath: string = `homes/${this.dbService.home}/regular`;

  constructor(private dbService: DbService) { }

  addRegularly(regularly: Regularly) {
    return this.dbService.createListValue(`${this.rootPath}`, regularly);
  }

  getAllByCycleType(cycleType: RegularlyCycleType) {
    return this.dbService.readFilteredList(`${this.rootPath}`, ref => ref.orderByChild('cycle').equalTo(cycleType));
  }

  updateRegularly(regularly: Regularly, key: string) {
    return this.dbService.updateListValue(`${this.rootPath}`, key, regularly);
  }
}
