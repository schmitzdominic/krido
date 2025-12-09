import { Component, inject, Injector, runInInjectionContext, ViewChild } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Budget} from "../../../../shared/interfaces/budget.model";
import {BudgetService} from "../../../services/budget/budget.service";
import {PriceService} from "../../../services/price/price.service";
import {LoadingService} from "../../../services/loading/loading.service";
import { map } from 'rxjs/operators';

interface DropdownItem {
  name: string;
  value: string;
}

@Component({
    selector: 'app-budget-list',
    templateUrl: './budget-list.component.html',
    styleUrls: ['./budget-list.component.scss'],
    standalone: false
})
export class BudgetListComponent {
  private ngbModal = inject(NgbModal);
  private budgetService = inject(BudgetService);
  private loadingService = inject(LoadingService);
  private injector = inject(Injector);
  priceService = inject(PriceService);


  @ViewChild('addBudgetModal') addBudgetModal: NgbModalRef | undefined;
  @ViewChild('editBudgetModal') editBudgetModal: NgbModalRef | undefined;

  addBudgetModalRef: NgbModalRef | undefined;
  editBudgetModalRef: NgbModalRef | undefined;

  typeNoTimeLimit: DropdownItem = {name: 'Ohne Zeitlimit', value: 'noTimeLimit'};
  typeMonthly: DropdownItem = {name: 'Monatlich', value: 'monthly'};

  noTimeLimitBudgets: (Budget & { id: string })[] = [];
  monthlyBudgets: (Budget & { id: string })[] = [];

  isNoTimeLimitInitialized: boolean = false;
  isMonthlyInitialized: boolean = false;

  clickedBudget: (Budget & { id: string }) | undefined;

  ngOnInit() {
      this.loadNoTimeLimitBudgets();
      this.loadTimeLimitBudgets();
  }

  onAddClick(): void {
    this.openAddBudgetModal();
  }

  onCardClick(budget: Budget & { id: string }): void {
    this.openEditBudgetModal(budget);
  }

  openAddBudgetModal(): void {
    this.addBudgetModalRef = this.ngbModal.open(
      this.addBudgetModal,
      {
        size: 'md'
      });
  }

  openEditBudgetModal(budget: Budget & { id: string }): void {
    this.clickedBudget = budget;
    this.editBudgetModalRef = this.ngbModal.open(
      this.editBudgetModal,
      {
        size: 'md'
      });
  }

  onCloseAddBudgetModal(): void {
    if (this.addBudgetModalRef) {
      this.addBudgetModalRef.close();
    }
  }

  onCloseEditBudgetModal(): void {
    if (this.editBudgetModalRef) {
      this.editBudgetModalRef.close();
    }
  }

  loadNoTimeLimitBudgets() {
    this.budgetService.getAllNoTimeLimitBudgets().pipe(
        map(budgets => budgets as (Budget & { id: string })[])
    ).subscribe(budgets => runInInjectionContext(this.injector, () => {
      this.noTimeLimitBudgets = budgets
          .filter(budget => !budget.isArchived)
          .map(budget => ({
            ...budget,
            usedLimit: budget.usedLimit ?? 0,
            limit: budget.limit ? Number(budget.limit) : undefined
          }));
      this.isNoTimeLimitInitialized = true;
      if (this.isMonthlyInitialized) this.loadingService.setLoading = false;
    }));
  }

  loadTimeLimitBudgets() {
    this.budgetService.getAllMonthlyBudgets().pipe(
        map(budgets => budgets as (Budget & { id: string })[])
    ).subscribe(budgets => runInInjectionContext(this.injector, () => {
      this.monthlyBudgets = budgets
          .filter(budget => !budget.isArchived)
          .map(budget => ({
            ...budget,
            usedLimit: budget.usedLimit ?? 0,
            limit: budget.limit ? Number(budget.limit) : undefined
          }));
      this.isMonthlyInitialized = true;
      if (this.isNoTimeLimitInitialized) this.loadingService.setLoading = false;
    }));
  }
}
