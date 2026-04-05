import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {Budget} from "../../../../shared/interfaces/budget.model";
import {BudgetService} from "../../../services/budget/budget.service";
import {DateService} from "../../../services/date/date.service";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { map } from 'rxjs/operators';

interface MonthBudget {
  name: string,
  monthString: string,
  budgets: (Budget & { id: string })[]
}

@Component({
    selector: 'app-budget-archive-list',
    templateUrl: './budget-archive-list.component.html',
    styleUrls: ['./budget-archive-list.component.scss'],
    standalone: false
})
export class BudgetArchiveListComponent implements OnInit {
  private ngbModal = inject(NgbModal);
  private budgetService = inject(BudgetService);
  private dateService = inject(DateService);
  private destroyRef = inject(DestroyRef);


  @ViewChild('editBudgetModal') public editBudgetModal: NgbModalRef | undefined;

  public editBudgetModalRef: NgbModalRef | undefined;

  public noTimeLimitBudgets: (Budget & { id: string })[] = [];
  public monthBudgets: MonthBudget[] = [];

  public clickedBudget: (Budget & { id: string }) | undefined;

  /**
   * Initializes the component.
   */
  public ngOnInit() {
    this.loadNoTimeLimitBudgets();
    this.loadTimeLimitBudgets();
  }

  /**
   * Loads archived budgets without a time limit.
   */
  private loadNoTimeLimitBudgets() {
    this.budgetService.getAllNoTimeLimitBudgets().pipe(
      map(budgets => budgets as (Budget & { id: string })[]),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(budgets => {
      this.noTimeLimitBudgets = budgets
        .filter(budget => budget.isArchived)
        .map(budget => this.prepareBudget(budget));
    });
  }

  /**
   * Loads archived monthly budgets.
   */
  private loadTimeLimitBudgets() {
    this.budgetService.getAllMonthlyBudgets().pipe(
      map(budgets => budgets as (Budget & { id: string })[]),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(budgets => {
      const archivedBudgets = budgets
        .filter(budget => budget.isArchived && budget.validityPeriod)
        .map(budget => this.prepareBudget(budget));

      this.monthBudgets = this.groupBudgetsByMonth(archivedBudgets);
    });
  }

  /**
   * Prepares a budget object by ensuring numeric values for limits.
   * @param {Budget & { id: string }} budget The budget to prepare.
   * @returns {Budget & { id: string }} The prepared budget.
   */
  private prepareBudget(budget: Budget & { id: string }): Budget & { id: string } {
    return {
      ...budget,
      usedLimit: budget.usedLimit ?? 0,
      limit: budget.limit ? Number(budget.limit) : undefined
    };
  }

  /**
   * Groups budgets by their validity period (month).
   * @param {(Budget & { id: string })[]} budgets The list of budgets.
   * @returns {MonthBudget[]} The grouped budgets.
   */
  private groupBudgetsByMonth(budgets: (Budget & { id: string })[]): MonthBudget[] {
    const budgetMap = new Map<string, MonthBudget>();

    budgets.forEach(budget => {
      const monthString = budget.validityPeriod!; // Is safe due to filter in loadTimeLimitBudgets
      let monthBudget = budgetMap.get(monthString);

      if (!monthBudget) {
        monthBudget = {
          name: `${this.dateService.getYear(monthString)} ${this.dateService.getMonthName(monthString)}`,
          monthString: monthString,
          budgets: []
        };
        budgetMap.set(monthString, monthBudget);
      }
      monthBudget.budgets.push(budget);
    });

    return Array.from(budgetMap.values()).sort((a, b) => b.monthString.localeCompare(a.monthString));
  }

  /**
   * Opens the edit modal for a specific budget.
   * @param {Budget & { id: string }} budget The budget to edit.
   */
  public onCardClick(budget: Budget & { id: string }) {
    this.openEditBudgetModal(budget);
  }

  /**
   * Opens the edit budget modal.
   * @param {Budget & { id: string }} budget The budget to edit.
   */
  public openEditBudgetModal(budget: Budget & { id: string }): void {
    this.clickedBudget = budget;
    (document.activeElement as HTMLElement)?.blur();
    this.editBudgetModalRef = this.ngbModal.open(
      this.editBudgetModal,
      {
        size: 'md'
      });
  }

  /**
   * Closes the edit budget modal.
   */
  public onCloseEditBudgetModal(): void {
    if (this.editBudgetModalRef) {
      this.editBudgetModalRef.close();
    }
  }

}
