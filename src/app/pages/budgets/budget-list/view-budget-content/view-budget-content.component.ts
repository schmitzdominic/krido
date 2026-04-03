import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {PriceService} from "../../../../services/price/price.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {ProgressBarService} from "../../../../services/progress-bar/progress-bar.service";
import {Entry} from "../../../../../shared/interfaces/entry.model";
import {EntryService} from "../../../../services/entry/entry.service";
import { map } from 'rxjs/operators';
import { EntryType } from '../../../../../shared/enums/entry-type.enum';

@Component({
    selector: 'app-view-budget-content',
    templateUrl: './view-budget-content.component.html',
    styleUrls: ['./view-budget-content.component.scss'],
    standalone: false
})
export class ViewBudgetContentComponent implements OnInit {
  private ngbProgressbarConfig = inject(NgbProgressbarConfig);
  private entryService = inject(EntryService);
  public progressBarService = inject(ProgressBarService);
  private destroyRef = inject(DestroyRef);
  public priceService = inject(PriceService);


  @Input() public budget: Budget & { id: string } | undefined;

  @Output() public onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onEditEntry: EventEmitter<Entry & { id: string }> = new EventEmitter();

  public isContentReadOnly: boolean = true;
  public isEditButtonShown: boolean = true;

  public entries: (Entry & { id: string })[] = [];

  public usedLimit: number = 0;

  /**
   * Initializes the component.
   */
  public ngOnInit(): void {
    this.checkIfLimitIsSet();
    this.loadProgressBarConfig();
    this.loadEntries();
  }

  /**
   * Checks if a limit is set on the budget.
   * If not, it enables edit mode and hides the edit button.
   */
  private checkIfLimitIsSet() {
    if (!this.budget?.limit) {
      this.isEditButtonShown = false;
      this.onEdit();
    }
  }

  /**
   * Configures the progress bar.
   */
  private loadProgressBarConfig() {
    this.progressBarService.setProgressBarConfig(this.ngbProgressbarConfig);
  }

  /**
   * Loads entries associated with the budget and calculates usedLimit from them.
   */
  private loadEntries() {
    if (this.budget && this.budget.id) {
      this.entryService.getAllEntriesByBudgetId(this.budget.id).pipe(
        map(entries => entries as (Entry & { id: string })[]),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(entries => {
        this.entries = entries;
        this.usedLimit = entries.reduce((acc, entry) => {
          if (entry.type === EntryType.outcome) return acc + entry.value;
          if (entry.type === EntryType.income) return acc - entry.value;
          return acc;
        }, 0);
        this.sortEntriesByDate(this.entries);
      });
    }
  }

  /**
   * Sorts entries by date in descending order.
   * @param {Entry[]} entries The entries to sort.
   */
  private sortEntriesByDate(entries: Entry[]) {
    entries.sort((one, two) => {
      return one.date > two.date ? -1 : 1;
    });
  }

  /**
   * Calculates the remaining budget.
   * @returns {string} The formatted remaining budget or 'N/A'.
   */
  public getRestBudget() {
    if (this.budget!.limit && this.usedLimit) {
      const restBudget: number = this.budget!.limit - this.usedLimit;
      return this.priceService.convertNumberToEuro(restBudget);
    } else {
      return this.budget?.limit ? this.priceService.convertNumberToEuro(this.budget?.limit) : 'N/A';
    }
  }

  /**
   * Generates the text for the progress bar.
   * @returns {string} The progress text (used / limit).
   */
  public getProgressBarText() {
    if ((this.usedLimit! / this.budget?.limit! * 100) < 35) {
      return '';
    } else {
      return this.priceService.convertNumberToEuro(this.usedLimit!)
        + ' / ' +
        this.priceService.convertNumberToEuro(this.budget?.limit!);
    }
  }

  /**
   * Toggles the read-only state.
   */
  public onEdit() {
    this.isContentReadOnly = !this.isContentReadOnly;
  }

  /**
   * Closes the view.
   */
  public onCancel() {
    this.onClose.emit();
  }

  public getRestClass(): string {
    if (!this.budget?.limit) return '';
    const pct = this.usedLimit / this.budget.limit * 100;
    if (pct >= 75) return 'rest--danger';
    if (pct >= 50) return 'rest--warning';
    return 'rest--success';
  }

  public onEntryClick(entry: Entry & { id: string }) {
    this.onEditEntry.emit(entry);
  }

}
