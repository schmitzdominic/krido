import { Component } from '@angular/core';
import {MenuTitleService} from "../../behavior/menu-title/menu-title.service";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent {

  constructor(private menuTitleService: MenuTitleService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Budgets');
    this.menuTitleService.setActiveId(5);
  }

}
