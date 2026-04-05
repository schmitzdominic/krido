import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {BudgetService} from "../../services/budget/budget.service";
import {Budget} from "../../../shared/interfaces/budget.model";
import { combineLatest } from 'rxjs';

@Component({
    selector: 'app-budgets',
    templateUrl: './budgets.component.html',
    styleUrls: ['./budgets.component.scss'],
    standalone: false
})
export class BudgetsComponent implements OnInit {
  private menuTitleService = inject(MenuTitleService);
  private budgetService = inject(BudgetService);
  private destroyRef = inject(DestroyRef);


  public active: string = 'budgets';
  public isArchiveShown: boolean = false;

  /**
   * Initializes the component.
   */
  public ngOnInit(): void {
    this.setInitialValues();
    this.checkForArchive();
  }

  /**
   * Sets initial values for the menu title.
   */
  private setInitialValues(): void {
    this.menuTitleService.setTitle('Budgets');
    this.menuTitleService.setActiveId(6);
  }

  /**
   * Checks if there are any archived budgets to toggle the archive view visibility.
   * Uses combineLatest to react to changes in either budget list.
   */
  private checkForArchive() {
    combineLatest([
      this.budgetService.getAllNoTimeLimitBudgets(),
      this.budgetService.getAllMonthlyBudgets()
    ]).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([noTimeLimitBudgets, monthlyBudgets]) => {
        const hasArchivedNoTimeLimit = (noTimeLimitBudgets as Budget[]).some(b => b.isArchived);
        const hasArchivedMonthly = (monthlyBudgets as Budget[]).some(b => b.isArchived);
        const newArchiveShown = hasArchivedNoTimeLimit || hasArchivedMonthly;

        if (newArchiveShown !== this.isArchiveShown) {
          this.isArchiveShown = newArchiveShown;
        }

        if (!this.isArchiveShown && this.active === 'archive') {
          this.active = 'budgets';
        }
    });
  }
}
