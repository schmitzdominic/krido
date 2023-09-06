import {Component, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {Budget} from "../../../../shared/interfaces/budget.model";
import {BudgetService} from "../../../services/budget/budget.service";
import {PriceService} from "../../../services/price/price.service";
import {LoadingService} from "../../../services/loading/loading.service";

interface DropdownItem {
  name: string;
  value: string;
}

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent {

  @ViewChild('addBudgetModal') addBudgetModal: NgbModalRef | undefined;
  @ViewChild('editBudgetModal') editBudgetModal: NgbModalRef | undefined;

  addBudgetModalRef: NgbModalRef | undefined;
  editBudgetModalRef: NgbModalRef | undefined;

  typeNoTimeLimit: DropdownItem = {name: 'Ohne Zeitlimit', value: 'noTimeLimit'};
  typeMonthly: DropdownItem = {name: 'Monatlich', value: 'monthly'};

  noTimeLimitBudgets: Budget[] = [];
  monthlyBudgets: Budget[] = [];

  isNoTimeLimitInitialized: boolean = false;
  isMonthlyInitialized: boolean = false;

  clickedBudget: Budget | undefined;

  constructor(private ngbModal: NgbModal,
              private budgetService: BudgetService,
              private loadingService: LoadingService,
              public priceService: PriceService) {
  }

  ngOnInit() {
      this.loadNoTimeLimitBudgets();
      this.loadTimeLimitBudgets();
  }

  onAddClick(): void {
    this.openAddBudgetModal();
  }

  onCardClick(budget: Budget): void {
    this.openEditBudgetModal(budget);
  }

  openAddBudgetModal(): void {
    this.addBudgetModalRef = this.ngbModal.open(
      this.addBudgetModal,
      {
        size: 'md'
      });
  }

  openEditBudgetModal(budget: Budget): void {
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
    this.budgetService.getAllNoTimeLimitBudgets().subscribe(budgets => {
      this.noTimeLimitBudgets = [];
      budgets.forEach(budgetRaw => {
        let budget: Budget = budgetRaw.payload.val() as Budget;
        budget.key = budgetRaw.key!;
        budget.usedLimit = budget.usedLimit ? budget.usedLimit : 0;
        budget.limit = budget.limit ? Number(budget.limit) : undefined;
        if (!budget.isArchived) {
          this.noTimeLimitBudgets.push(budget);
        }
      });
      this.isNoTimeLimitInitialized = true;
      if (this.isMonthlyInitialized) this.loadingService.setLoading = false;
    });
  }

  loadTimeLimitBudgets() {
    this.budgetService.getAllMonthlyBudgets().subscribe(budgets => {
      this.monthlyBudgets = [];
      budgets.forEach(budgetRaw => {
        let budget: Budget = budgetRaw.payload.val() as Budget;
        budget.key = budgetRaw.key!;
        budget.usedLimit = budget.usedLimit ? budget.usedLimit : 0;
        budget.limit = budget.limit ? Number(budget.limit) : undefined;
        if (!budget.isArchived) {
          this.monthlyBudgets.push(budget);
        }
      });
      this.isMonthlyInitialized = true;
      if (this.isNoTimeLimitInitialized) this.loadingService.setLoading = false;
    });
  }
}
