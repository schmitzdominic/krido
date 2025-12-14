import { Injectable, inject } from '@angular/core';
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
import { from, of } from 'rxjs';
import { map, switchMap, tap, mergeMap, filter, take } from 'rxjs/operators';

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


  private lastMonthString: string = '';
  private nextMonthString: string = '';

  public createEntries() {
    if (this.userService.home) {
      this.homeService.getActualMonthString().pipe(
        take(1), // Ensure the stream completes after the first value
        switchMap(dbMonthString => {
          // Case 1: No month string in DB, set it for the first time.
          if (!dbMonthString) {
            return from(this.homeService.setActualMonthString());
          }
          // Case 2: DB month is outdated, create next month's data.
          const actualMonth = Number(this.dateService.getMonthStringFromMonth(0));
          if (dbMonthString < actualMonth) {
            this.lastMonthString = this.dateService.getMonthStringFromMonth(-1);
            this.nextMonthString = this.dateService.getMonthStringFromMonth(1);
            // Chain the promise to set the new month string
            return from(this.homeService.setActualMonthString()).pipe(
              tap(() => this.createNextMonthData())
            );
          }
          // Case 3: DB is up-to-date, do nothing.
          return of(undefined);
        })
      ).subscribe(); // A single subscription to trigger the whole chain.
    }
  }

  private createNextMonthData() {
    this.createBudgets();
    this.createRegularEntries();
    this.createCreditCardEntries();
    this.toastService.showSuccess('Nächster Monat wurde angelegt', 3000);
  }

  private createBudgets() {
    this.budgetService.getAllMonthBudgetsByMonthString(this.lastMonthString).pipe(
      map(budgets => budgets as (Budget & { id: string })[]), // Explicitly type the stream
      take(1),
      // Flatten the array of budgets into individual budget emissions
      mergeMap((budgets: (Budget & { id: string })[]) => from(budgets)),
      // Filter out archived budgets
      filter((budget: Budget & { id: string }) => !budget.isArchived && !!budget.id),
      // Process each budget
      tap((budget: Budget & { id: string }) => this.updateBudget(budget))
    ).subscribe();
  }

  private updateBudget(budget: Budget & { id: string }) {
    this.setBudgetValues(budget);
    budget.isArchived = true;

    if (budget.cycleKey && budget.id) {
      this.budgetService.getCycle(budget.cycleKey).pipe(
        map(cycle => cycle as Cycle | null), // Explicitly type the stream
        take(1),
        filter((cycle: Cycle | null): cycle is Cycle => !!cycle),
        switchMap(cycle =>
          from(this.budgetService.updateMonthBudget(budget, budget.id)).pipe(
            tap(() => this.createNewBudgetFromOldBudget(budget, cycle))
          )
        )
      ).subscribe();
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
      map(regularities => regularities as Regularly[]), // Explicitly type the stream
      take(1),
      mergeMap((regularities: Regularly[]) => from(regularities)),
      tap((regularly: Regularly) => this.checkRegularMonth(regularly))
    ).subscribe();

    // TODO: Quarter

    // Year
    this.regularlyService.getAllByCycleType(RegularlyCycleType.year).pipe(
      map(regularities => regularities as Regularly[]), // Explicitly type the stream
      take(1),
      mergeMap((regularities: Regularly[]) => from(regularities)),
      filter((regularly: Regularly) => !!regularly.date),
      tap((regularly: Regularly) => this.checkRegularYear(regularly))
    ).subscribe();
  }

  private checkRegularMonth(regularly: Regularly) {

    // Calculate Time for monthly regular entry
    const year: number = this.dateService.getYear(this.nextMonthString);
    const month: number = this.dateService.getNextMonthNumber();
    const day: number = regularly.isEndOfMonth ? this.dateService.getLastDayOfMonth(new Date(year, month)) : regularly.monthDay;

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
      map(accounts => accounts as Account[]), // Explicitly type the stream
      take(1),
      mergeMap((accounts: Account[]) => from(accounts)),
      tap((account: Account) => this.checkAccountAndCreateEntry(account))
    ).subscribe();
  }

  private checkAccountAndCreateEntry(account: Account) {
    // Calculate Time for monthly regular entry
    const year: number = this.dateService.getYear(this.nextMonthString);
    const month: number = this.dateService.getNextMonthNumber();
    const day: number = account.creditLastDay ? this.dateService.getLastDayOfMonth(new Date(year, month)) : (account.creditDay ?? 1);

    const date: Date = new Date(year, month, day);
    const entry: Entry = this.createEntryObjectFromAccount(account, this.dateService.getAvailableWeekdayAsTimestampFromTimestamp(date.getTime()), this.nextMonthString);
    this.entryService.addEntry(entry);
  }
}
