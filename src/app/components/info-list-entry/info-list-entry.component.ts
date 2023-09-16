import {Component, Input} from '@angular/core';
import {Account} from "../../../shared/interfaces/account.model";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {PriceService} from "../../services/price/price.service";
import {DateService} from "../../services/date/date.service";
import {EntryService} from "../../services/entry/entry.service";
import {Entry} from "../../../shared/interfaces/entry.model";
import {EntryType} from "../../../shared/enums/entry-type.enum";
import {BudgetService} from "../../services/budget/budget.service";
import {Budget} from "../../../shared/interfaces/budget.model";

@Component({
  selector: 'app-info-list-entry',
  templateUrl: './info-list-entry.component.html',
  styleUrls: ['./info-list-entry.component.scss']
})
export class InfoListEntryComponent {

  @Input() account: Account | undefined;

  protected readonly AccountType = AccountType;

  overallValueLeftBudgets: number = 0;
  overallValueEntries: number = 0;

  constructor(public priceService: PriceService,
              private dateService: DateService,
              private entryService: EntryService,
              private budgetService: BudgetService) {
  }

  ngOnInit() {
    this.calculateRest();
  }

  getPrice(account: Account) {
    return `${account.value! < 0 ? '-' : ''} ${this.priceService.convertNumberToEuro(Math.abs(account.value!))}`
  }

  getDate() {
    const date: Date = this.dateService.getDateFromTimestamp(this.account?.updatedDate!);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  calculateRest() {
    if (this.account!.updatedDate) {

      // Budgets
      this.budgetService.getAllMonthBudgetsByMonthString(this.dateService.getActualMonthString()).subscribe(budgets => {
        this.overallValueLeftBudgets = 0;
        budgets.filter(budget => !(budget.payload.val() as Budget).isArchived).forEach(budgetRaw => {
          const budget: Budget = budgetRaw.payload.val() as Budget;
          budget.key = budgetRaw.key ? budgetRaw.key : '';
          this.updateValueLeftByBudget(budget);
        });
      });

      // Entries
      this.entryService.getAllEntriesByMonthString(this.dateService.getActualMonthString()).subscribe(entries => {
        this.overallValueEntries = 0;
        entries.filter(entry => {
          return (entry.payload.val() as Entry).account.key === this.account!.key! && (entry.payload.val() as Entry).date >= this.account?.updatedDate!;
        }).forEach(entryRaw => {
          const entry: Entry = entryRaw.payload.val() as Entry;
          entry.key = entryRaw.key ? entryRaw.key : '';
          this.updateValueLeftByEntry(entry);
        });
      });
    }
  }

  updateValueLeftByEntry(entry: Entry) {
    switch (entry.type) {
      case EntryType.income: this.overallValueEntries -= entry.value; break;
      case EntryType.outcome: this.overallValueEntries += entry.value; break;
    }
  }

  updateValueLeftByBudget(budget: Budget) {
    const restBudget: number = budget.limit! - budget.usedLimit!;
    if (restBudget > 0) {
      this.overallValueLeftBudgets += restBudget;
    }
  }

  calculateOverallRest(): number {
    let valueLeft: number = this.account?.value!;
    valueLeft -= this.overallValueEntries;
    valueLeft -= this.overallValueLeftBudgets;
    return valueLeft;
  }
}
