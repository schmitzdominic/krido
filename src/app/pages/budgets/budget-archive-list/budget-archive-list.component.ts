import { Component, inject, Injector, runInInjectionContext, ViewChild } from '@angular/core';
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
export class BudgetArchiveListComponent {
  private ngbModal = inject(NgbModal);
  private budgetService = inject(BudgetService);
  private dateService = inject(DateService);
  private injector = inject(Injector);


  @ViewChild('editBudgetModal') editBudgetModal: NgbModalRef | undefined;

  editBudgetModalRef: NgbModalRef | undefined;

  noTimeLimitBudgets: (Budget & { id: string })[] = [];
  monthBudgets: MonthBudget[] = [];

  clickedBudget: (Budget & { id: string }) | undefined;

  ngOnInit() {
    this.loadNoTimeLimitBudgets();
    this.loadTimeLimitBudgets();
  }

  loadNoTimeLimitBudgets() {
    this.budgetService.getAllNoTimeLimitBudgets().pipe(
      map(budgets => budgets as (Budget & { id: string })[])
    ).subscribe(budgets => runInInjectionContext(this.injector, () => {
      this.noTimeLimitBudgets = budgets
        .filter(budget => budget.isArchived)
        .map(budget => ({
          ...budget,
          usedLimit: budget.usedLimit ?? 0,
          limit: budget.limit ? Number(budget.limit) : undefined
        }));
    }));
  }

  loadTimeLimitBudgets() {
    this.budgetService.getAllMonthlyBudgets().pipe(
      map(budgets => budgets as (Budget & { id: string })[])
    ).subscribe(budgets => runInInjectionContext(this.injector, () => {
      this.monthBudgets = [];
      const archivedBudgets = budgets.map(budget => ({
        ...budget,
        usedLimit: budget.usedLimit ?? 0,
        limit: budget.limit ? Number(budget.limit) : undefined
      }));

      archivedBudgets.forEach(budget => {
        if (budget.isArchived) {
          this.addMonthlyBudgetToList(budget);
        }
      });
      // Sort descending
      this.monthBudgets.sort((one, two) => (one.monthString > two.monthString ? -1 : 1));
    }));
  }

  addMonthlyBudgetToList(budget: Budget & { id: string }) {
    const foundMonthBudget: MonthBudget | undefined = this.monthBudgets.find(monthBudget => monthBudget.monthString == budget.validityPeriod);
    if (foundMonthBudget) {
      foundMonthBudget.budgets.push(budget);
    } else {
      const monthBudget: MonthBudget = {
        name: `${this.dateService.getYear(budget.validityPeriod!)} ${this.dateService.getMonthName(budget.validityPeriod!)}`,
        monthString: String(budget.validityPeriod),
        budgets: [budget]
      };
      this.monthBudgets.push(monthBudget);
    }
  }

  onCardClick(budget: Budget & { id: string }) {
    this.openEditBudgetModal(budget);
  }

  openEditBudgetModal(budget: Budget & { id: string }): void {
    this.clickedBudget = budget;
    this.editBudgetModalRef = this.ngbModal.open(
      this.editBudgetModal,
      {
        size: 'md'
      });
  }

  onCloseEditBudgetModal(): void {
    if (this.editBudgetModalRef) {
      this.editBudgetModalRef.close();
    }
  }

}
