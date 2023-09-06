import {Component, Input} from '@angular/core';
import {Budget} from "../../../shared/interfaces/budget.model";
import {ProgressBarService} from "../../services/progress-bar/progress-bar.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {PriceService} from "../../services/price/price.service";
import {EntryService} from "../../services/entry/entry.service";
import {Entry} from "../../../shared/interfaces/entry.model";
import {BudgetService} from "../../services/budget/budget.service";

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
    this.progressBarService.setProgressBarConfig(this.ngbProgressbarConfig);
  }

  ngOnInit() {
    this.calculateUsedLimit();
  }

  calculateUsedLimit() {
    if (this.budget!.key) {
      this.entryService.getAllEntriesByBudgetKey(this.budget!.key).subscribe(entries => {
        entries.forEach(entryRAW => {
          const entry: Entry = entryRAW.payload.val() as Entry;
          this.usedLimit = this.usedLimit + entry.value;
        });
      });
    }
  }

}
