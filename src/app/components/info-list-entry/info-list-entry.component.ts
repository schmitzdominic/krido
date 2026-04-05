import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {Account} from "../../../shared/interfaces/account.model";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {PriceService} from "../../services/price/price.service";
import {DateService} from "../../services/date/date.service";
import {EntryService} from "../../services/entry/entry.service";
import {Entry} from "../../../shared/interfaces/entry.model";
import {EntryType} from "../../../shared/enums/entry-type.enum";
import {BudgetService} from "../../services/budget/budget.service";
import {Budget} from "../../../shared/interfaces/budget.model";
import {combineLatest, map, Subject, switchMap} from "rxjs";

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
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @Input() account: Account | undefined;

  protected readonly AccountType = AccountType;

  overallValueLeftBudgets: number = 0;
  overallValueEntries: number = 0;

  private accountChange$ = new Subject<Account>();

  constructor() {
    this.accountChange$.pipe(
      switchMap(account => {
        const monthString = this.dateService.getActualMonthString();

        const monthBudgets$ = this.budgetService.getAllMonthBudgetsByMonthString(monthString).pipe(
          map(budgets => budgets as Budget[])
        );
        const allTimeBudgets$ = this.budgetService.getAllNoTimeLimitBudgets().pipe(
          map(budgets => budgets as Budget[])
        );
        const entries$ = this.entryService.getAllEntriesByMonthString(monthString).pipe(
          map(entries => entries as Entry[])
        );

        return combineLatest([monthBudgets$, allTimeBudgets$, entries$]).pipe(
          map(([monthBudgets, allTimeBudgets, entries]) => ({ monthBudgets, allTimeBudgets, entries, account }))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ monthBudgets, allTimeBudgets, entries, account }) => {
      const allBudgets = [...monthBudgets, ...allTimeBudgets];

      // Only entries for THIS account after updatedDate — same set for both calculations.
      // Entries before updatedDate are already baked into account.value; entries from other
      // accounts don't affect this account's balance.
      const relevantEntries = entries.filter(entry => {
        const entryAccountId = (entry.account as any)?.id ?? (entry.account as any)?.key;
        const currentAccountId = (account as any)?.id ?? (account as any)?.key;
        return entryAccountId && currentAccountId && entryAccountId === currentAccountId
          && entry.date >= account.updatedDate!;
      });

      // Compute how much of each budget has been spent via the relevant entries.
      // This way pre-updatedDate or other-account entries don't distort the remaining budget.
      const budgetUsedLimitMap = new Map<string, number>();
      for (const entry of relevantEntries) {
        const budgetId = entry.budgetKey ?? (entry as any).budget?.id ?? (entry as any).budget?.key;
        if (budgetId) {
          const cur = budgetUsedLimitMap.get(budgetId) ?? 0;
          const delta = entry.type === EntryType.income ? -entry.value : entry.value;
          budgetUsedLimitMap.set(budgetId, cur + delta);
        }
      }

      // Remaining planned budget (future spending still to come this month)
      this.overallValueLeftBudgets = allBudgets
        .filter(budget => !budget.isArchived)
        .reduce((acc, budget) => {
          const limit = budget.limit ?? 0;
          const usedLimit = budgetUsedLimitMap.get((budget as any).id) ?? 0;
          const restBudget = limit - usedLimit;
          return acc + (limit < 0 || restBudget > 0 ? restBudget : 0);
        }, 0);

      // Sum all relevant entries (budget-assigned ones cancel out against overallValueLeftBudgets,
      // so their net effect on rest is 0 — only non-budget entries move the needle)
      this.overallValueEntries = relevantEntries
        .reduce((acc, entry) => acc + this.getValueLeftByEntry(entry), 0);

      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['account'] && changes['account'].currentValue) {
      this.accountChange$.next(changes['account'].currentValue);
    }
  }

  getPrice(account: Account) {
    return `${account.value! < 0 ? '-' : ''} ${this.priceService.convertNumberToEuro(Math.abs(account.value!))}`
  }

  getDate() {
    const date: Date = this.dateService.getDateFromTimestamp(this.account?.updatedDate!);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  getValueLeftByEntry(entry: Entry): number {
    return entry.type === EntryType.income ? -entry.value : entry.value;
  }

  calculateOverallRest(): number {
    let valueLeft: number = this.account?.value!;
    valueLeft -= this.overallValueEntries;
    valueLeft -= this.overallValueLeftBudgets;
    return valueLeft;
  }
}
