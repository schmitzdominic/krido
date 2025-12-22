import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class BudgetListComponent implements OnInit {
  private ngbModal = inject(NgbModal);
  private budgetService = inject(BudgetService);
  private loadingService = inject(LoadingService);
  private destroyRef = inject(DestroyRef);
  public priceService = inject(PriceService);


  @ViewChild('addBudgetModal') public addBudgetModal: NgbModalRef | undefined;
  @ViewChild('editBudgetModal') public editBudgetModal: NgbModalRef | undefined;

  public addBudgetModalRef: NgbModalRef | undefined;
  public editBudgetModalRef: NgbModalRef | undefined;

  public typeNoTimeLimit: DropdownItem = {name: 'Ohne Zeitlimit', value: 'noTimeLimit'};
  public typeMonthly: DropdownItem = {name: 'Monatlich', value: 'monthly'};

  public noTimeLimitBudgets: (Budget & { id: string })[] = [];
  public monthlyBudgets: (Budget & { id: string })[] = [];

  public isNoTimeLimitInitialized: boolean = false;
  public isMonthlyInitialized: boolean = false;

  public clickedBudget: (Budget & { id: string }) | undefined;

  /**
   * Initializes the component.
   */
  public ngOnInit() {
      this.loadNoTimeLimitBudgets();
      this.loadTimeLimitBudgets();
  }

  /**
   * Opens the add budget modal.
   */
  public onAddClick(): void {
    this.openAddBudgetModal();
  }

  /**
   * Opens the edit budget modal for the selected budget.
   * @param {Budget & { id: string }} budget The budget to edit.
   */
  public onCardClick(budget: Budget & { id: string }): void {
    this.openEditBudgetModal(budget);
  }

  /**
   * Opens the modal to add a new budget.
   */
  public openAddBudgetModal(): void {
    this.addBudgetModalRef = this.ngbModal.open(
      this.addBudgetModal,
      {
        size: 'md'
      });
  }

  /**
   * Opens the modal to edit an existing budget.
   * @param {Budget & { id: string }} budget The budget to edit.
   */
  public openEditBudgetModal(budget: Budget & { id: string }): void {
    this.clickedBudget = budget;
    this.editBudgetModalRef = this.ngbModal.open(
      this.editBudgetModal,
      {
        size: 'md'
      });
  }

  /**
   * Closes the add budget modal.
   */
  public onCloseAddBudgetModal(): void {
    if (this.addBudgetModalRef) {
      this.addBudgetModalRef.close();
    }
  }

  /**
   * Closes the edit budget modal.
   */
  public onCloseEditBudgetModal(): void {
    if (this.editBudgetModalRef) {
      this.editBudgetModalRef.close();
    }
  }

  /**
   * Loads budgets without a time limit.
   */
  private loadNoTimeLimitBudgets() {
    this.budgetService.getAllNoTimeLimitBudgets().pipe(
        map(budgets => budgets as (Budget & { id: string })[]),
        takeUntilDestroyed(this.destroyRef)
    ).subscribe(budgets => {
      this.noTimeLimitBudgets = this.processBudgets(budgets);
      this.isNoTimeLimitInitialized = true;
      if (this.isMonthlyInitialized) this.loadingService.setLoading = false;
    });
  }

  /**
   * Loads monthly budgets.
   */
  private loadTimeLimitBudgets() {
    this.budgetService.getAllMonthlyBudgets().pipe(
        map(budgets => budgets as (Budget & { id: string })[]),
        takeUntilDestroyed(this.destroyRef)
    ).subscribe(budgets => {
      this.monthlyBudgets = this.processBudgets(budgets);
      this.isMonthlyInitialized = true;
      if (this.isNoTimeLimitInitialized) this.loadingService.setLoading = false;
    });
  }

  /**
   * Processes the raw budget list: filters archived ones and formats numbers.
   * @param {(Budget & { id: string })[]} budgets The raw budgets.
   * @returns {(Budget & { id: string })[]} The processed budgets.
   */
  private processBudgets(budgets: (Budget & { id: string })[]): (Budget & { id: string })[] {
    return budgets
      .filter(budget => !budget.isArchived)
      .map(budget => ({
        ...budget,
        usedLimit: budget.usedLimit ?? 0,
        limit: budget.limit ? Number(budget.limit) : undefined
      }));
  }
}
