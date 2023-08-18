import {Component, ViewChild} from '@angular/core';
import {NgbModal, NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {Budget} from "../../../entities/budget.model";
import {BudgetService} from "../../../services/budget/budget.service";
import {PriceService} from "../../../services/price/price.service";

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

  addBudgetModalRef: NgbModalRef | undefined;

  typeNoTimeLimit: DropdownItem = {name: 'Ohne Zeitlimit', value: 'noTimeLimit'};
  typeMonthly: DropdownItem = {name: 'Monatlich', value: 'monthly'};

  chosenType: DropdownItem = this.typeNoTimeLimit;

  budgets: Budget[] = [];

  constructor(private ngbModal: NgbModal,
              private budgetService: BudgetService,
              private ngbProgressbarConfig: NgbProgressbarConfig,
              public priceService: PriceService) {
  }

  ngOnInit() {
      this.loadNoTimeLimitBudgets();
      this.loadProgressBarConfig();
  }

  loadProgressBarConfig() {
      this.ngbProgressbarConfig.max = 1000;
      this.ngbProgressbarConfig.striped = true;
      this.ngbProgressbarConfig.animated = true;
      this.ngbProgressbarConfig.type = 'success';
      this.ngbProgressbarConfig.height = '20px';
  }

  onAddClick(): void {
    this.openAddBudgetModal();
  }

  openAddBudgetModal(): void {
    this.addBudgetModalRef = this.ngbModal.open(
      this.addBudgetModal,
      {
        size: 'sm'
      });
  }

  onCloseAddBudgetModal(): void {
    if (this.addBudgetModalRef) {
      this.addBudgetModalRef.close();
    }
  }

  chooseType(type: DropdownItem) {
      this.chosenType = type;
      this.onTypeChange();
  }

  onTypeChange() {
    switch(this.chosenType.value) {
        case this.typeNoTimeLimit.value: {
          this.loadNoTimeLimitBudgets();
          break;
        }
        case this.typeMonthly.value: {
          break;
        }
    }
  }

  loadNoTimeLimitBudgets() {
    this.budgetService.getAllNoTimeLimitBudgets().subscribe(budgets => {
      this.budgets = [];
      budgets.forEach(budgetRaw => {
        let budget: Budget = budgetRaw.payload.val() as Budget;
        budget.usedLimit = budget.usedLimit ? budget.usedLimit : 0;
        budget.limit = budget.limit ? budget.limit : 100;
        this.budgets.push(budget);
      })
    })
  }

  getProgressBarType(value: number, max: number): string {
    const progress = value / max * 100;
    if (progress >= 75) {
      return 'danger';
    } else if (progress >= 50) {
      return 'warning';
    } else {
      return 'success';
    }
  }
}
