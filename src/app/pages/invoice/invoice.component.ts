import { Component } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  constructor(private menuTitleService: MenuTitleService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Abrechnung');
    this.menuTitleService.setActiveId(2);
  }

}
