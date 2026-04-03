import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {DateService} from "../../services/date/date.service";
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {BudgetService} from "../../services/budget/budget.service";
import {Budget} from "../../../shared/interfaces/budget.model";
import {Entry} from "../../../shared/interfaces/entry.model";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PredictService} from "../../services/predict/predict.service";
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * HomeComponent displays the main dashboard, showing budgets for the current month and all-time budgets.
 */
@Component({
    selector: 'app-actual-month',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  private menuTitleService = inject(MenuTitleService);
  private dateService = inject(DateService);
  private budgetService = inject(BudgetService);
  private ngbModal = inject(NgbModal);
  private predictService = inject(PredictService);

  // Reference to the <ng-template> in the HTML
  @ViewChild('viewBudgetModal') private viewBudgetModalTemplate: TemplateRef<any> | undefined;
  @ViewChild('editEntryModal') private editEntryModalTemplate: TemplateRef<any> | undefined;

  private activeModalRef: NgbModalRef | undefined;
  private editEntryModalRef: NgbModalRef | undefined;

  public actualMonth: string = this.dateService.getActualMonthName();
  public monthString: string = this.dateService.getActualMonthString();
  public actualYear: number = this.dateService.getActualYear();

  public clickedBudget: Budget & { id: string } | undefined;
  public selectedEntry: (Entry & { id: string }) | undefined;
  public allBudgets: (Budget & { id: string })[] = [];

  private destroy$ = new Subject<void>();

  /**
   * Angular lifecycle hook that runs on component initialization.
   */
  public ngOnInit(): void {
    this.predictService.createEntries();
    this.setInitialValues();
    this.loadAllBudgets();
  }

  /**
   * Angular lifecycle hook that runs when the component is destroyed.
   */
  public ngOnDestroy(): void {
    if (this.activeModalRef) {
      this.activeModalRef.close();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Sets the initial values for the component, such as the menu title.
   */
  private setInitialValues(): void {
    const actualDate: Date = this.dateService.getActualDate();
    this.menuTitleService.setTitle(this.dateService.getDayShortName(actualDate.getDay()) + ' ' + actualDate.getDate() + '. ' + this.actualMonth + ' ' + this.actualYear);
    this.menuTitleService.setActiveId(1);
  }

  /**
   * Loads all-time and monthly budgets concurrently and merges them.
   */
  private loadAllBudgets(): void {
    const allTimeBudgets$ = this.budgetService.getAllNoTimeLimitBudgets();
    const monthlyBudgets$ = this.budgetService.getAllMonthlyBudgets();
    const currentMonth = this.dateService.getActualMonthString();

    combineLatest([allTimeBudgets$, monthlyBudgets$]).pipe(
      map(([allTime, monthly]) => {
        return [
          ...(allTime as (Budget & { id: string })[]).filter(b => !b.isArchived),
          ...(monthly as (Budget & { id: string })[]).filter(
            b => !b.isArchived && String(b.validityPeriod) === currentMonth
          )
        ];
      }),
      takeUntil(this.destroy$)
    ).subscribe(combinedBudgets => {
      this.allBudgets = combinedBudgets;
    });
  }

  /**
   * Opens a modal to view the details of a selected budget.
   * @param budget The budget to be displayed in the modal.
   */
  public openViewBudgetModal(budget: Budget & { id: string }): void {
    if (!this.viewBudgetModalTemplate) {
      return;
    }
    this.clickedBudget = budget;
    this.activeModalRef = this.ngbModal.open(
      this.viewBudgetModalTemplate,
      {
        size: 'md'
      });
  }

  /**
   * Closes the currently open budget view modal.
   */
  public onCloseViewBudgetModal(): void {
    if (this.activeModalRef) {
      this.activeModalRef.close();
    }
  }

  public onEditEntryFromBudget(entry: Entry & { id: string }): void {
    this.onCloseViewBudgetModal();
    this.selectedEntry = entry;
    if (this.editEntryModalTemplate) {
      this.editEntryModalRef = this.ngbModal.open(this.editEntryModalTemplate, { size: 'md' });
    }
  }

  public onCloseEditEntryModal(): void {
    if (this.editEntryModalRef) {
      this.editEntryModalRef.close();
    }
    this.selectedEntry = undefined;
  }
}
