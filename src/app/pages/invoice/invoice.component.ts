import { Component, inject } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {InvoiceSettings} from "../../../shared/interfaces/invoice-settings.model";

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    standalone: false
})
export class InvoiceComponent {
  private menuTitleService = inject(MenuTitleService);

  showInvoice = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  public onNextSettings(_invoiceSettings: InvoiceSettings): void {
    this.showInvoice = true;
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Abrechnung');
    this.menuTitleService.setActiveId(2);
  }

}
