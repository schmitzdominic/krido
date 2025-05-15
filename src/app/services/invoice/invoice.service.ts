import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {InvoiceSettings} from "../../../shared/interfaces/invoice-settings.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private rootPath: string =  `homes/${this.dbService.home}/invoice`;

  constructor(private dbService: DbService) { }

  addInvoiceSettings(invoiceSettings: InvoiceSettings) {
    return this.dbService.create(`${this.rootPath}/settings`, invoiceSettings);
  }

  updateInvoiceSettings(invoiceSettings: InvoiceSettings) {
    return this.dbService.update(`${this.rootPath}/settings`, invoiceSettings);
  }

  getInvoiceSettings() {
    return this.dbService.read(`${this.rootPath}/settings`);
  }
}
