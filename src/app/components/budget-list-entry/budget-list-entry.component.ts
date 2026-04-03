import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import {Budget} from "../../../shared/interfaces/budget.model";
import {ProgressBarService} from "../../services/progress-bar/progress-bar.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {PriceService} from "../../services/price/price.service";
import {EntryService} from "../../services/entry/entry.service";
import {Entry} from "../../../shared/interfaces/entry.model";
import {EntryType} from "../../../shared/enums/entry-type.enum";
import { map, Subject, takeUntil } from 'rxjs';

/**
 * Displays a single budget entry, including its name, limit, and a progress bar
 * indicating the used portion of the budget.
 */
@Component({
    selector: 'app-budget-list-entry',
    templateUrl: './budget-list-entry.component.html',
    styleUrls: ['./budget-list-entry.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetListEntryComponent implements OnInit, OnDestroy {
  private ngbProgressbarConfig = inject(NgbProgressbarConfig);
  public progressBarService = inject(ProgressBarService);
  public priceService = inject(PriceService);
  private entryService = inject(EntryService);
  private cdr = inject(ChangeDetectorRef);

  /**
   * The budget data to be displayed. The component expects a budget object with an ID.
   */
  @Input({ required: true }) public budget!: Budget & { id: string };

  /**
   * The calculated amount of the budget that has been used.
   */
  public usedLimit: number = 0;

  private destroy$ = new Subject<void>();

  /**
   * @param ngbProgressbarConfig Injected configuration for ng-bootstrap progress bars.
   */
  constructor() {
    // This global configuration should ideally be set once in a root component (e.g., AppComponent)
    // to avoid being called for every instance of this component.
    this.progressBarService.setProgressBarConfig(this.ngbProgressbarConfig);
  }

  /**
   * Angular lifecycle hook that runs on component initialization.
   */
  public ngOnInit(): void {
    if (this.budget) {
      this.fetchAndCalculateUsedLimit();
    }
  }

  /**
   * Angular lifecycle hook that runs when the component is destroyed.
   * It completes the `destroy$` subject to prevent memory leaks from open subscriptions.
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fetches all entries associated with the current budget and calculates the total used amount.
   * Note: This implementation reads from the database but no longer writes back,
   * which is a significant performance improvement. The `usedLimit` is now a view-only concern.
   */
  private fetchAndCalculateUsedLimit(): void {
    this.entryService.getAllEntriesByBudgetKey(this.budget.id).pipe(
      map(entries => (entries as Entry[]).reduce(
        (acc, entry) => this.calculateNewValue(acc, entry), 0)
      ),
      takeUntil(this.destroy$)
    ).subscribe(calculatedLimit => {
      this.usedLimit = calculatedLimit;
      this.cdr.markForCheck();
    });
  }

  /**
   * Calculates the new accumulated value based on an entry's type.
   * Incomes decrease the used amount (as they free up budget), while outcomes increase it.
   * @param currentValue The current accumulated value.
   * @param entry The entry to process.
   * @returns The new accumulated value.
   */
  private calculateNewValue(currentValue: number, entry: Entry): number {
    switch (entry.type) {
      case EntryType.income: return currentValue - entry.value;
      case EntryType.outcome: return currentValue + entry.value;
      default: return currentValue;
    }
  }

  /**
   * Generates the text to be displayed inside the progress bar.
   * Shows the percentage only if more than 35% of the budget is used.
   * @returns The percentage string or an empty string.
   */
  public getProgressBarText(): string {
    if (!this.budget.limit || this.budget.limit === 0) return '';

    const percentage = (this.usedLimit / this.budget.limit) * 100;
    if (percentage < 35) {
      return '';
    }
    return `${Math.round(percentage)}%`;
  }
}
