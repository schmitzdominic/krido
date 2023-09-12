import {Component, ViewChild} from '@angular/core';
import {DateService} from "../../services/date/date.service";
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {BudgetService} from "../../services/budget/budget.service";
import {Budget} from "../../../shared/interfaces/budget.model";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {LoadingService} from "../../services/loading/loading.service";

@Component({
  selector: 'app-actual-month',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild('viewBudgetModal') viewBudgetModal: NgbModalRef | undefined;

  protected readonly AccountType = AccountType;

  viewBudgetModalRef: NgbModalRef | undefined;

  actualMonth: string = this.dateService.getActualMonthName();
  monthString: string = this.dateService.getActualMonthString();

  actualYear: number = this.dateService.getActualYear();

  isAllTimeBudgetsAvailable: boolean = false;
  isMonthlyBudgetsAvailable: boolean = false;
  isEntriesAvailable: boolean = false;
  isNotLoading: boolean = false;

  clickedBudget: Budget | undefined;

  allTimeBudgets: Budget[] = [];
  monthlyBudgets: Budget[] = [];

  constructor(private menuTitleService: MenuTitleService,
              private dateService: DateService,
              private budgetService: BudgetService,
              private ngbModal: NgbModal,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
    this.loadBudgets();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle(this.actualMonth + ' ' + this.actualYear);
    this.menuTitleService.setActiveId(1);
  }

  loadBudgets() {
    this.loadAllTimeBudgets();
    this.loadMonthlyBudgets();
  }

  private loadAllTimeBudgets() {
    this.budgetService.getAllNoTimeLimitBudgets().subscribe(budgets => {
      this.allTimeBudgets = [];
      budgets.filter(budgetRaw => !(budgetRaw.payload.val() as Budget).isArchived).forEach(budgetRaw => {
        const budget: Budget = budgetRaw.payload.val() as Budget;
        budget.key = budgetRaw.key ? budgetRaw.key : '';
        this.allTimeBudgets.push(budget);
      });
      this.isAllTimeBudgetsAvailable = this.allTimeBudgets.length > 0;
    });
  }

  private loadMonthlyBudgets() {
    this.budgetService.getAllThisMonthBudgets(this.dateService.getActualMonthString()).subscribe(budgets => {
      this.monthlyBudgets = [];
      budgets.filter(budgetRaw => !(budgetRaw.payload.val() as Budget).isArchived).forEach(budgetRaw => {
        const budget: Budget = budgetRaw.payload.val() as Budget;
        budget.key = budgetRaw.key ? budgetRaw.key : '';
        this.monthlyBudgets.push(budget);
      });
      this.isMonthlyBudgetsAvailable = this.monthlyBudgets.length > 0;
    });
  }

  checkIfLoading() {
    this.loadingService.isLoading.subscribe(isLoading => {
      this.isNotLoading = !isLoading;
    });
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

  onEntriesLoaded(isEntriesAvailable: boolean) {
    this.isEntriesAvailable = isEntriesAvailable;
  }

  isContentAvailable(): boolean {
    return this.isMonthlyBudgetsAvailable || this.isAllTimeBudgetsAvailable || this.isEntriesAvailable;
  }
}
