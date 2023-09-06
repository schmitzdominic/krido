import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {PriceService} from "../../../../services/price/price.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {ProgressBarService} from "../../../../services/progress-bar/progress-bar.service";
import {Entry} from "../../../../../shared/interfaces/entry.model";
import {EntryService} from "../../../../services/entry/entry.service";
import {EntryType} from "../../../../../shared/enums/entry-type.enum";

@Component({
  selector: 'app-view-budget-content',
  templateUrl: './view-budget-content.component.html',
  styleUrls: ['./view-budget-content.component.scss']
})
export class ViewBudgetContentComponent {

  @Input() budget: Budget | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  isContentReadOnly: boolean = true;
  isEditButtonShown: boolean = true;

  entries: Entry[] = [];

  usedLimit: number = 0;

  constructor(private ngbProgressbarConfig: NgbProgressbarConfig,
              private entryService: EntryService,
              public progressBarService: ProgressBarService,
              public priceService: PriceService) {
  }

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
    if (this.budget!.key!) {
      this.entryService.getAllEntriesByBudgetKey(this.budget!.key).subscribe(entries => {
        this.entries = [];
        entries.forEach(entryRaw => {
          const entry: Entry = entryRaw.payload.val() as Entry;
          entry.key = entryRaw.key ? entryRaw.key : '';
          this.calculateUsedLimit(entry);
          this.entries.push(entry);
        });
        this.sortEntriesByDate(this.entries);
      });
    }
  }

  calculateUsedLimit(entry: Entry) {
    switch (entry.type) {
      case EntryType.income: this.usedLimit = this.usedLimit - entry.value; break;
      case EntryType.outcome: this.usedLimit = this.usedLimit + entry.value; break;
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
