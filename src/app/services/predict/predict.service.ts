import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
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
import {UserService} from "../user/user.service";
import {AccountService} from "../account/account.service";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {Account} from "../../../shared/interfaces/account.model";
import {EntryType} from "../../../shared/enums/entry-type.enum";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PredictService {
  private budgetService = inject(BudgetService);
  private userService = inject(UserService);
  private homeService = inject(HomeService);
  private dateService = inject(DateService);
  private regularlyService = inject(RegularlyService);
  private entryService = inject(EntryService);
  private toastService = inject(ToastService);
  private accountService = inject(AccountService);
  private injector = inject(Injector);


  private lastMonthString: string = '';
  private nextMonthString: string = '';

  public createEntries() {
    if (this.userService.home) {
      this.homeService.getActualMonthString().pipe(
        map(dbMonthString => dbMonthString as number | null)
      ).subscribe(dbMonthString => runInInjectionContext(this.injector, () => {
        // If no month string is set in the DB, set it for the first time and stop.
        if (!dbMonthString) {
          // If no month string is set in the DB, set it for the first time.
          this.homeService.setActualMonthString().then();
          return;
        }

        // if the db monthString is lower than the actual one, create entries for the next month.
        if (dbMonthString < Number(this.dateService.getMonthStringFromMonth(0))) {
          this.lastMonthString = this.dateService.getMonthStringFromMonth(-1);
          this.nextMonthString = this.dateService.getMonthStringFromMonth(1);

          this.homeService.setActualMonthString().then(() => {            
            runInInjectionContext(this.injector, () => {
              this.createBudgets();
              this.createRegularEntries();
              this.createCreditCardEntries();
              this.toastService.showSuccess('Nächster Monat wurde angelegt', 3000);
            });
          });
        }
      }));
    }
  }

  private createBudgets() {
    this.budgetService.getAllMonthBudgetsByMonthString(this.lastMonthString).pipe(
      map(budgets => budgets as (Budget & { id: string })[])
    ).subscribe(budgets => runInInjectionContext(this.injector, () => {
      // The service now returns a clean array of Budget objects.
      budgets.forEach(budget => {
        if (!budget.isArchived && budget.id) {
          this.updateBudget(budget);
        }
      });
    }));
  }

  private updateBudget(budget: Budget & { id: string }) {
    this.setBudgetValues(budget);
    budget.isArchived = true;

    if (budget.cycleKey && budget.id) {
      this.budgetService.getCycle(budget.cycleKey).pipe(
        map(cycle => cycle as Cycle | null)
      ).subscribe(cycle => runInInjectionContext(this.injector, () => {
        if (cycle) {          
          this.budgetService.updateMonthBudget(budget, budget.id)
            .then(() => runInInjectionContext(this.injector, () => this.createNewBudgetFromOldBudget(budget, cycle)));
        }
      }));
    }
  }

  private setBudgetValues(budget: Budget) {
    budget.limit = budget.limit ?? 0;
    budget.usedLimit = budget.usedLimit ?? 0;
    budget.entries = budget.entries ?? [];
  }

  private createNewBudgetFromOldBudget(budget: Budget & { id: string }, cycle: Cycle) {
    // If Rest Budget should be used
    if (cycle.isTransfer) {
      const restBudget: number = (budget.limit ?? 0) - (budget.usedLimit ?? 0);
      budget.limit = (cycle.limit ?? 0) + restBudget;
    }

    // Create a new object without the 'id' property for the new DB entry.
    const { id, ...newBudget } = budget;

    newBudget.isArchived = false;
    newBudget.usedLimit = 0;
    newBudget.entries = [];
    newBudget.validityPeriod = this.dateService.getActualMonthString();
    this.budgetService.addMonthBudget(newBudget);
  }

  private createRegularEntries() {

    // Month
    this.regularlyService.getAllByCycleType(RegularlyCycleType.month).pipe(
      map(regularities => regularities as Regularly[])
    ).subscribe(regularities => runInInjectionContext(this.injector, () => {
      regularities.forEach(regularly => {
        this.checkRegularMonth(regularly);
      });
    }));

    // TODO: Quarter

    // Year
    this.regularlyService.getAllByCycleType(RegularlyCycleType.year).pipe(
      map(regularities => regularities as Regularly[])
    ).subscribe(regularities => runInInjectionContext(this.injector, () => {
      regularities.forEach(regularly => {
        this.checkRegularYear(regularly);
      });
    }));
  }

  private checkRegularMonth(regularly: Regularly) {

    // Calculate Time for monthly regular entry
    const year: number = this.dateService.getYear(this.nextMonthString);
    const month: number = this.dateService.getNextMonthNumber();
    const day: number = regularly.isEndOfMonth ? this.dateService.setDateToLastDayOfMonth(new Date(year, month)) : regularly.monthDay;

    const date: Date = new Date(year, month, day);
    const entry: Entry = this.createEntryObjectFromRegularly(regularly, this.dateService.getAvailableWeekdayAsTimestampFromTimestamp(date.getTime()), this.nextMonthString);

    this.entryService.addEntry(entry);
  }

  private checkRegularYear(regularly: Regularly) {
    if (regularly.date) {
      const dateFromTimestamp: Date = this.dateService.getDateFromTimestamp(regularly.date);
      if (this.dateService.getNextMonthNumber() == dateFromTimestamp.getMonth()) {
        const entry: Entry = this.createEntryObjectFromRegularly(regularly, this.dateService.getAvailableWeekdayAsTimestampFromTimestamp(regularly.date), this.nextMonthString);
        this.entryService.addEntry(entry);
      }
    }
  }

  private createEntryObjectFromRegularly(regularly: Regularly, date: number, monthString: string): Entry {
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

  private createEntryObjectFromAccount(account: Account, date: number, monthString: string): Entry {
    const value: number = account.value ?? 0;
    const referenceAccount: Account = account.referenceAccount ?? this.accountService.noAccountValue;
    return {
      name: account.name,
      searchName: account.searchName,
      type: value < 0 ? EntryType.outcome : EntryType.income,
      value: value,
      account: referenceAccount,
      date: date,
      monthString: monthString
    }
  }

  private createCreditCardEntries() {
    this.accountService.getAllAccountsFilteredByAccountType(AccountType.creditCard).pipe(
      map(accounts => accounts as Account[]) // Safely cast the type within the pipe
    ).subscribe(accounts => runInInjectionContext(this.injector, () => {
      accounts.forEach(account => this.checkAccountAndCreateEntry(account));
    }));
  }

  private checkAccountAndCreateEntry(account: Account) {
    // Calculate Time for monthly regular entry
    const year: number = this.dateService.getYear(this.nextMonthString);
    const month: number = this.dateService.getNextMonthNumber();
    const day: number = account.creditLastDay ? this.dateService.setDateToLastDayOfMonth(new Date(year, month)) : (account.creditDay ?? 1);

    const date: Date = new Date(year, month, day);
    const entry: Entry = this.createEntryObjectFromAccount(account, this.dateService.getAvailableWeekdayAsTimestampFromTimestamp(date.getTime()), this.nextMonthString);
    this.entryService.addEntry(entry);
  }
}
