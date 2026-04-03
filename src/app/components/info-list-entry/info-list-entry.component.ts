import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Injector, Input, OnChanges, runInInjectionContext, SimpleChanges } from '@angular/core';
import {Account} from "../../../shared/interfaces/account.model";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {PriceService} from "../../services/price/price.service";
import {DateService} from "../../services/date/date.service";
import {EntryService} from "../../services/entry/entry.service";
import {Entry} from "../../../shared/interfaces/entry.model";
import {EntryType} from "../../../shared/enums/entry-type.enum";
import {BudgetService} from "../../services/budget/budget.service";
import {Budget} from "../../../shared/interfaces/budget.model";
import {forkJoin, map} from "rxjs";

@Component({
    selector: 'app-info-list-entry',
    templateUrl: './info-list-entry.component.html',
    styleUrls: ['./info-list-entry.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoListEntryComponent implements OnChanges {
  priceService = inject(PriceService);
  private dateService = inject(DateService);
  private entryService = inject(EntryService);
  private budgetService = inject(BudgetService);
  private injector = inject(Injector);
  private cdr = inject(ChangeDetectorRef);


  @Input() account: Account | undefined;

  protected readonly AccountType = AccountType;

  overallValueLeftBudgets: number = 0;
  overallValueEntries: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['account'] && changes['account'].currentValue) {
      this.calculateRest();
    }
  }

  getPrice(account: Account) {
    return `${account.value! < 0 ? '-' : ''} ${this.priceService.convertNumberToEuro(Math.abs(account.value!))}`
  }

  getDate() {
    const date: Date = this.dateService.getDateFromTimestamp(this.account?.updatedDate!);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  calculateRest() {
    if (this.account?.updatedDate) {
      const monthString = this.dateService.getActualMonthString();

      // Budgets
      const budgets$ = this.budgetService.getAllMonthBudgetsByMonthString(monthString).pipe(
        map(budgets => budgets as Budget[])
      );

      // Entries
      const entries$ = this.entryService.getAllEntriesByMonthString(monthString).pipe(
        map(entries => entries as Entry[])
      );

      forkJoin([budgets$, entries$]).subscribe(([budgets, entries]) => runInInjectionContext(this.injector, () => {
        // Process Budgets
        this.overallValueLeftBudgets = budgets
          .filter(budget => !budget.isArchived)
          .reduce((acc, budget) => acc + this.getValueLeftByBudget(budget), 0);

        // Process Entries
        this.overallValueEntries = entries
          .filter(entry => (entry.account as any)?.id === (this.account as any)?.id && entry.date >= this.account!.updatedDate!)
          .reduce((acc, entry) => acc + this.getValueLeftByEntry(entry), 0);

        this.cdr.markForCheck();
      }));
    }
  }

  getValueLeftByEntry(entry: Entry): number {
    return entry.type === EntryType.income ? -entry.value : entry.value;
  }

  getValueLeftByBudget(budget: Budget): number {
    const restBudget: number = budget.limit! - budget.usedLimit!;
    if (budget.limit! < 0 || restBudget > 0) {
      return restBudget;
    }
    return 0;
  }

  calculateOverallRest(): number {
    let valueLeft: number = this.account?.value!;
    valueLeft -= this.overallValueEntries;
    valueLeft -= this.overallValueLeftBudgets;
    return valueLeft;
  }
}
