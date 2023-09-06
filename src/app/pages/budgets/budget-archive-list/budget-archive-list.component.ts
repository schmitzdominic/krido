import {Component, ViewChild} from '@angular/core';
import {Budget} from "../../../../shared/interfaces/budget.model";
import {BudgetService} from "../../../services/budget/budget.service";
import {DateService} from "../../../services/date/date.service";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

interface MonthBudget {
  name: string,
  monthString: string,
  budgets: Budget[]
}

@Component({
  selector: 'app-budget-archive-list',
  templateUrl: './budget-archive-list.component.html',
  styleUrls: ['./budget-archive-list.component.scss']
})
export class BudgetArchiveListComponent {

  @ViewChild('editBudgetModal') editBudgetModal: NgbModalRef | undefined;

  editBudgetModalRef: NgbModalRef | undefined;

  noTimeLimitBudgets: Budget[] = [];
  monthBudgets: MonthBudget[] = [];

  clickedBudget: Budget | undefined;

  constructor(private ngbModal: NgbModal,
              private budgetService: BudgetService,
              private dateService: DateService) {
  }

  ngOnInit() {
    this.loadNoTimeLimitBudgets();
    this.loadTimeLimitBudgets();
  }

  loadNoTimeLimitBudgets() {
    this.budgetService.getAllNoTimeLimitBudgets().subscribe(budgets => {
      this.noTimeLimitBudgets = [];
      budgets.forEach(budgetRaw => {
        let budget: Budget = budgetRaw.payload.val() as Budget;
        budget.key = budgetRaw.key!;
        budget.usedLimit = budget.usedLimit ? budget.usedLimit : 0;
        budget.limit = budget.limit ? Number(budget.limit) : undefined;
        if (budget.isArchived) {
          this.noTimeLimitBudgets.push(budget);
        }
      });
    });
  }

  loadTimeLimitBudgets() {
    this.budgetService.getAllMonthlyBudgets().subscribe(budgets => {
      this.monthBudgets = [];
      budgets.forEach(budgetRaw => {
        let budget: Budget = budgetRaw.payload.val() as Budget;
        budget.key = budgetRaw.key!;
        budget.usedLimit = budget.usedLimit ? budget.usedLimit : 0;
        budget.limit = budget.limit ? Number(budget.limit) : undefined;
        if (budget.isArchived) {
          this.addMonthlyBudgetToList(budget);
        }
      });
      // Sort descending
      this.monthBudgets.sort((one, two) => (one.monthString > two.monthString ? -1 : 1));
    });
  }

  addMonthlyBudgetToList(budget: Budget) {
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

  onCardClick(budget: Budget) {
    this.openEditBudgetModal(budget);
  }

  openEditBudgetModal(budget: Budget): void {
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
