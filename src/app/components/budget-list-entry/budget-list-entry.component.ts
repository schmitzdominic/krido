import { Component, EnvironmentInjector, inject, Injector, Input, runInInjectionContext } from '@angular/core';
import {Budget} from "../../../shared/interfaces/budget.model";
import {ProgressBarService} from "../../services/progress-bar/progress-bar.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {PriceService} from "../../services/price/price.service";
import {EntryService} from "../../services/entry/entry.service";
import {Entry} from "../../../shared/interfaces/entry.model";
import {BudgetService} from "../../services/budget/budget.service";
import {EntryType} from "../../../shared/enums/entry-type.enum";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-budget-list-entry',
    templateUrl: './budget-list-entry.component.html',
    styleUrls: ['./budget-list-entry.component.scss'],
    standalone: false
})
export class BudgetListEntryComponent {
  private ngbProgressbarConfig = inject(NgbProgressbarConfig);
  progressBarService = inject(ProgressBarService);
  priceService = inject(PriceService);
  entryService = inject(EntryService);
  budgetService = inject(BudgetService);
  private injector = inject(Injector);


  @Input({ required: true }) budget: (Budget & { id: string }) | undefined;

  usedLimit: number = 0;

  constructor() {
    // WARNING Not part of lifecycle! This Config MUST be loaded before all.
    this.progressBarService.setProgressBarConfig(this.ngbProgressbarConfig);
  }

  ngOnInit() {
    if (this.budget) {
      this.calculateUsedLimit();
    }
  }

  calculateUsedLimit() {
    if (this.budget?.id) {
      this.entryService.getAllEntriesByBudgetKey(this.budget.id).pipe(
        map(entries => entries as Entry[])
      ).subscribe(entries => {
        this.usedLimit = entries.reduce((acc, entry) => this.calculate(acc, entry), 0);

        if (this.budget?.limit) {
          this.budget!.usedLimit = this.usedLimit;
          runInInjectionContext(this.injector, () => {
            if (this.budget!.validityPeriod) {
              this.budgetService.updateMonthBudget(this.budget!, this.budget!.id);
            } else {
              this.budgetService.updateNoTimeLimitBudget(this.budget!, this.budget!.id);
            }
          });
        }
      });
    }
  }

  calculate(currentValue: number, entry: Entry): number {
    switch (entry.type) {
      case EntryType.income: return currentValue - entry.value;
      case EntryType.outcome: return currentValue + entry.value;
      default: return currentValue;
    }
  }

  getProgressBarText() {
    if ((this.usedLimit! / this.budget?.limit! * 100) < 35) {
      return '';
    } else {
      return (Math.round(this.usedLimit / this.budget!.limit! * 100)) + '%';
    }
  }

  protected readonly Math = Math;
}
