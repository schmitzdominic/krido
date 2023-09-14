import { Component } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {BudgetService} from "../../services/budget/budget.service";
import {Budget} from "../../../shared/interfaces/budget.model";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent {

  active: string = 'budgets';
  isArchiveShown: boolean = false;

  constructor(private menuTitleService: MenuTitleService,
              private budgetService: BudgetService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
    this.checkForArchive();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Budgets');
    this.menuTitleService.setActiveId(6);
  }

  checkForArchive() {
    this.budgetService.getAllNoTimeLimitBudgets().subscribe(budgets => {
      if (!this.isArchiveShown) {
        this.isArchiveShown = !!budgets.find(b => (b.payload.val()! as Budget).isArchived);
      }
    });
    this.budgetService.getAllMonthlyBudgets().subscribe(budgets => {
      if (!this.isArchiveShown) {
        this.isArchiveShown = !!budgets.find(b => (b.payload.val()! as Budget).isArchived);
      }
    });
  }
}
