import { Component, inject } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {BudgetService} from "../../services/budget/budget.service";
import {Budget} from "../../../shared/interfaces/budget.model";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-budgets',
    templateUrl: './budgets.component.html',
    styleUrls: ['./budgets.component.scss'],
    standalone: false
})
export class BudgetsComponent {
  private menuTitleService = inject(MenuTitleService);
  private budgetService = inject(BudgetService);


  active: string = 'budgets';
  isArchiveShown: boolean = false;

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
    this.budgetService.getAllNoTimeLimitBudgets().pipe(
      map(budgets => budgets as Budget[])
    ).subscribe(budgets => {
      if (!this.isArchiveShown) {
        this.isArchiveShown = !!budgets.find(b => b.isArchived);
      }
    });
    this.budgetService.getAllMonthlyBudgets().pipe(
      map(budgets => budgets as Budget[])
    ).subscribe(budgets => {
      if (!this.isArchiveShown) {
        this.isArchiveShown = !!budgets.find(b => b.isArchived);
      }
    });
  }
}
