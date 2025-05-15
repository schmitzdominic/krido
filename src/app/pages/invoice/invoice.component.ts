import { Component } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {InvoiceSettings} from "../../../shared/interfaces/invoice-settings.model";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  active: string = 'settings';
  breadCrumbActive: string = 'breadcrumb-item';
  breadCrumbInactive: string = 'breadcrumb-item active';

  classSettings: string = this.breadCrumbActive;
  classInvoice: string = this.breadCrumbInactive;

  invoiceSettings: InvoiceSettings | undefined;

  constructor(private menuTitleService: MenuTitleService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  public onNextSettings(invoiceSettings: InvoiceSettings): void {
    this.invoiceSettings = invoiceSettings;
    this.active = 'invoice';
    this.classSettings = this.breadCrumbInactive;
    this.classInvoice = this.breadCrumbActive;
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Abrechnung');
    this.menuTitleService.setActiveId(2);
  }

}
