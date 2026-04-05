import { Injectable, inject } from '@angular/core';
import {DbService} from "../db.service";
import {InvoiceSettings} from "../../../shared/interfaces/invoice-settings.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private dbService = inject(DbService);


  private get rootPath(): string { return `homes/${this.dbService.home}/invoice`; }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

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
