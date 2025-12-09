import { Component, inject, Injector, runInInjectionContext, ViewChild } from '@angular/core';
import {DateService} from "../../services/date/date.service";
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {BudgetService} from "../../services/budget/budget.service";
import {Budget} from "../../../shared/interfaces/budget.model";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {PredictService} from "../../services/predict/predict.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-actual-month',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {
  private menuTitleService = inject(MenuTitleService);
  private dateService = inject(DateService);
  private budgetService = inject(BudgetService);
  private ngbModal = inject(NgbModal);
  private predictService = inject(PredictService);
  private injector = inject(Injector);


  @ViewChild('viewBudgetModal') viewBudgetModal: NgbModalRef | undefined;

  protected readonly AccountType = AccountType;

  viewBudgetModalRef: NgbModalRef | undefined;

  actualMonth: string = this.dateService.getActualMonthName();
  monthString: string = this.dateService.getActualMonthString();

  actualYear: number = this.dateService.getActualYear();

  clickedBudget: Budget | undefined;

  allTimeBudgets: (Budget & { id: string })[] = [];
  monthlyBudgets: (Budget & { id: string })[] = [];

  ngOnInit(): void {
    this.predictService.createEntries();
    this.setInitialValues();
    this.loadBudgets();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    const actualDate: Date = this.dateService.getActualDate();
    this.menuTitleService.setTitle(this.dateService.getDayShortName(actualDate.getDay()) + ' ' + actualDate.getDate() + '. ' + this.actualMonth + ' ' + this.actualYear);
    this.menuTitleService.setActiveId(1);
  }

  loadBudgets() {
    this.loadAllTimeBudgets();
    this.loadMonthlyBudgets();
  }

  private loadAllTimeBudgets() {
    this.budgetService.getAllNoTimeLimitBudgets().pipe(
      map(budgets => budgets as (Budget & { id: string })[])
    ).subscribe(budgets => runInInjectionContext(this.injector, () => {
      this.allTimeBudgets = budgets.filter(budget => !budget.isArchived);
    }));
  }

  private loadMonthlyBudgets() {
    this.budgetService.getAllMonthBudgetsByMonthString(this.dateService.getActualMonthString()).pipe(
      map(budgets => budgets as (Budget & { id: string })[])
    ).subscribe(budgets => runInInjectionContext(this.injector, () => {
      this.monthlyBudgets = budgets.filter(budget => !budget.isArchived);
    }));
  }

  openViewBudgetModal(budget: Budget): void {
    this.clickedBudget = budget;
    this.viewBudgetModalRef = this.ngbModal.open(
      this.viewBudgetModal,
      {
        size: 'md'
      });
  }

  onCloseViewBudgetModal(): void {
    if (this.viewBudgetModalRef) {
      this.viewBudgetModalRef.close();
    }
  }
}
