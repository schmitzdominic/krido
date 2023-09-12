import {Injectable} from '@angular/core';
import {BudgetService} from "../budget/budget.service";
import {HomeService} from "../home/home.service";
import {DateService} from "../date/date.service";
import {Budget} from "../../../shared/interfaces/budget.model";
import {Cycle} from "../../../shared/interfaces/cycle.model";
import {RegularlyService} from "../regularly/regularly.service";
import {RegularlyCycleType} from "../../../shared/enums/regularly-cycle-type.enum";
import {Regularly} from "../../../shared/interfaces/regularly.model";
import {Entry} from "../../../shared/interfaces/entry.model";
import {EntryService} from "../entry/entry.service";
import {ToastService} from "../toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class PredictService {

  private lastMonthString: string = '';
  private nextMonthString: string = '';

  constructor(private budgetService: BudgetService,
              private homeService: HomeService,
              private dateService: DateService,
              private regularlyService: RegularlyService,
              private entryService: EntryService,
              private toastService: ToastService) { }

  public createEntries() {
    this.homeService.getActualMonthString().subscribe(dbMonthString => {
      if (dbMonthString.payload.val()) {
        // if the db monthString is lower than the actual one

        if ((dbMonthString.payload.val() as number) < (Number(this.dateService.getMonthStringFromMonth(0)))) {
          this.lastMonthString = this.dateService.getMonthStringFromMonth(-1);

          this.nextMonthString = this.dateService.getMonthStringFromMonth(1);
          this.homeService.setActualMonthString().then(() => {

            this.createBudgets();
            this.createRegularEntries();

            this.toastService.showSuccess('Nächster Monat wurde angelegt', 3000);
          });
        }
      }
    });
  }

  private createBudgets() {
    this.budgetService.getAllMonthBudgetsByMonthString(this.lastMonthString).subscribe(budgets => {
      budgets.forEach(budgetRaw => {
        const budget: Budget = budgetRaw.payload.val() as Budget;
        budget.key = budgetRaw.key ? budgetRaw.key : '';
        if (!budget.isArchived) {
          this.updateBudget(budget);
        }
      });
    });
  }

  private updateBudget(budget: Budget) {
    this.setBudgetValues(budget);
    budget.isArchived = true;
    this.budgetService.getCycle(budget.cycleKey!).subscribe(cycleRaw => {
      const cycle: Cycle = cycleRaw.payload.val() as Cycle;
      this.budgetService.updateMonthBudget(budget, budget.key!).then(() => {
        this.createNewBudgetFromOldBudget(budget, cycle.isTransfer);
      });
    });
  }

  private setBudgetValues(budget: Budget) {
    budget.limit = budget.limit ? budget.limit : 0;
    budget.usedLimit = budget.usedLimit ? budget.usedLimit : 0;
    budget.entries = budget.entries ? budget.entries : [];
  }

  private createNewBudgetFromOldBudget(budget: Budget, isTransfer: boolean) {
    // If Rest Budget should be used
    if (isTransfer) {
      const restBudget: number = budget.limit! - budget.usedLimit!
      budget.limit = budget.limit! + restBudget;
    }
    delete budget['key'];
    budget.isArchived = false;
    budget.usedLimit = 0;
    budget.entries!.length = 0;
    budget.validityPeriod = this.dateService.getActualMonthString();
    this.budgetService.addMonthBudget(budget);
  }

  private createRegularEntries() {

    // Month
    this.regularlyService.getAllByCycleType(RegularlyCycleType.month).subscribe(regularities => {
      regularities.forEach(regularlyRaw => {
        const regularly: Regularly = regularlyRaw.payload.val() as Regularly;
        regularly.key = regularlyRaw.key ? regularlyRaw.key : '';
        this.checkRegularMonth(regularly);
      });
    });

    // TODO: Quarter

    // Year
    this.regularlyService.getAllByCycleType(RegularlyCycleType.year).subscribe(regularities => {
      regularities.forEach(regularlyRaw => {
        const regularly: Regularly = regularlyRaw.payload.val() as Regularly;
        regularly.key = regularlyRaw.key ? regularlyRaw.key : '';
        this.checkRegularYear(regularly);
      });
    });
  }

  private checkRegularMonth(regularly: Regularly) {

    // Calculate Time for monthly regular entry
    const year: number = this.dateService.getYear(this.nextMonthString);
    const month: number = this.dateService.getNextMonthNumber();
    const day: number = regularly.isEndOfMonth ? this.dateService.setDateToLastDayOfMonth(new Date()) : regularly.monthDay;

    const date: Date = new Date(year, month, day);
    const entry: Entry = this.createEntryObject(regularly, this.dateService.getAvailableWeekdayAsTimestampFromTimestamp(date.getTime()), this.nextMonthString);

    this.entryService.addEntry(entry);
  }

  private checkRegularYear(regularly: Regularly) {
    if (regularly.date) {
      const dateFromTimestamp: Date = this.dateService.getDateFromTimestamp(regularly.date);
      if (this.dateService.getNextMonthNumber() == dateFromTimestamp.getMonth()) {
        const entry: Entry = this.createEntryObject(regularly, this.dateService.getAvailableWeekdayAsTimestampFromTimestamp(regularly.date), this.nextMonthString);
        this.entryService.addEntry(entry);
      }
    }
  }

  private createEntryObject(regularly: Regularly, date: number, monthString: string): Entry {
    return {
      name: regularly.name,
      searchName: regularly.searchName,
      type: regularly.entryType,
      value: regularly.value,
      account: regularly.account,
      date: date,
      monthString: monthString
    }
  }
}
