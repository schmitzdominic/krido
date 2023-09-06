import {Component, Input} from '@angular/core';
import {Budget} from "../../../shared/interfaces/budget.model";
import {ProgressBarService} from "../../services/progress-bar/progress-bar.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {PriceService} from "../../services/price/price.service";
import {EntryService} from "../../services/entry/entry.service";
import {Entry} from "../../../shared/interfaces/entry.model";
import {BudgetService} from "../../services/budget/budget.service";
import {EntryType} from "../../../shared/enums/entry-type.enum";

@Component({
  selector: 'app-budget-list-entry',
  templateUrl: './budget-list-entry.component.html',
  styleUrls: ['./budget-list-entry.component.scss']
})
export class BudgetListEntryComponent {

  @Input({ required: true }) budget: Budget | undefined;

  usedLimit: number = 0;

  constructor(private ngbProgressbarConfig: NgbProgressbarConfig,
              public progressBarService: ProgressBarService,
              public priceService: PriceService,
              public entryService: EntryService,
              public budgetService: BudgetService) {
    // WARNING Not part of lifecycle! This Config MUST be loaded before all.
    this.progressBarService.setProgressBarConfig(this.ngbProgressbarConfig);
  }

  ngOnInit() {
    this.calculateUsedLimit();
  }

  calculateUsedLimit() {
    if (this.budget!.key) {
      this.entryService.getAllEntriesByBudgetKey(this.budget!.key).subscribe(entries => {
        this.usedLimit = 0;
        entries.forEach(entryRAW => {
          const entry: Entry = entryRAW.payload.val() as Entry;
          this.calculate(entry);
        });
      });
    }
  }

  calculate(entry: Entry) {
    switch (entry.type) {
      case EntryType.income: this.usedLimit = this.usedLimit - entry.value; break;
      case EntryType.outcome: this.usedLimit = this.usedLimit + entry.value; break;
    }
  }

  getProgressBarText() {
    if ((this.usedLimit! / this.budget?.limit! * 100) < 35) {
      return '';
    } else {
      return (Math.round(this.usedLimit / this.budget!.limit! * 100)) + '%';
    }
  }

}
