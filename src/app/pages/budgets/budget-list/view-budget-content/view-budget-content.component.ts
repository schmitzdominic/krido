import { Component, EventEmitter, inject, Injector, Input, Output, runInInjectionContext } from '@angular/core';
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {PriceService} from "../../../../services/price/price.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {ProgressBarService} from "../../../../services/progress-bar/progress-bar.service";
import {Entry} from "../../../../../shared/interfaces/entry.model";
import {EntryService} from "../../../../services/entry/entry.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-view-budget-content',
    templateUrl: './view-budget-content.component.html',
    styleUrls: ['./view-budget-content.component.scss'],
    standalone: false
})
export class ViewBudgetContentComponent {
  private ngbProgressbarConfig = inject(NgbProgressbarConfig);
  private entryService = inject(EntryService);
  progressBarService = inject(ProgressBarService);
  private injector = inject(Injector);
  priceService = inject(PriceService);


  @Input() budget: (Budget & { id: string }) | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  isContentReadOnly: boolean = true;
  isEditButtonShown: boolean = true;

  entries: (Entry & { id: string })[] = [];

  usedLimit: number = 0;

  ngOnInit(): void {
    this.checkIfLimitIsSet();
    this.loadProgressBarConfig();
    this.setUsedLimit();
    this.loadEntries();
  }

  checkIfLimitIsSet() {
    if (!this.budget?.limit) {
      this.isEditButtonShown = false;
      this.onEdit();
    }
  }

  loadProgressBarConfig() {
    this.progressBarService.setProgressBarConfig(this.ngbProgressbarConfig);
  }

  setUsedLimit() {
    if (this.budget && this.budget.usedLimit) {
      this.usedLimit = this.budget.usedLimit;
    } else {
      this.usedLimit = 0;
    }
  }

  loadEntries() {
    if (this.budget?.id) {
      this.entryService.getAllEntriesByBudgetKey(this.budget.id).pipe(
        map(entries => entries as (Entry & { id: string })[])
      ).subscribe(entries => runInInjectionContext(this.injector, () => {
        this.entries = entries;
        this.sortEntriesByDate(this.entries);
      }));
    }
  }

  private sortEntriesByDate(entries: Entry[]) {
    entries.sort((one, two) => {
      return one.date > two.date ? -1 : 1;
    });
  }

  getRestBudget() {
    if (this.budget!.limit && this.usedLimit) {
      const restBudget: number = this.budget!.limit - this.usedLimit;
      return this.priceService.convertNumberToEuro(restBudget);
    } else {
      return this.budget?.limit ? this.priceService.convertNumberToEuro(this.budget?.limit) : 'N/A';
    }
  }

  getProgressBarText() {
    if ((this.usedLimit! / this.budget?.limit! * 100) < 35) {
      return '';
    } else {
      return this.priceService.convertNumberToEuro(this.usedLimit!)
        + ' / ' +
        this.priceService.convertNumberToEuro(this.budget?.limit!);
    }
  }

  onEdit() {
    this.isContentReadOnly = !this.isContentReadOnly;
  }

  onCancel() {
    this.onClose.emit();
  }

}
