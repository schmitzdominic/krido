import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Entry } from '../../../../../shared/interfaces/entry.model';
import { EntryType } from '../../../../../shared/enums/entry-type.enum';
import { PriceService } from '../../../../services/price/price.service';
import { DateService } from '../../../../services/date/date.service';

interface CalculatorRow {
  entry: Entry & { id: string };
  runningBalance: number;
}

@Component({
  selector: 'app-next-month-calculator',
  templateUrl: './next-month-calculator.component.html',
  styleUrls: ['./next-month-calculator.component.scss'],
  standalone: false
})
export class NextMonthCalculatorComponent {
  priceService = inject(PriceService);
  dateService = inject(DateService);

  @Input() entries: (Entry & { id: string })[] = [];
  @Input() monthName: string = '';
  @Output() onClose = new EventEmitter<void>();

  startAmount: number = 0;
  results: CalculatorRow[] | null = null;
  finalBalance: number = 0;

  protected readonly EntryType = EntryType;

  calculate(): void {
    const sorted = [...this.entries].sort((a, b) => a.date - b.date);
    let balance = this.startAmount;
    this.results = sorted.map(entry => {
      balance += entry.type === EntryType.income ? entry.value : -entry.value;
      return { entry, runningBalance: balance };
    });
    this.finalBalance = balance;
  }

  reset(): void {
    this.results = null;
    this.startAmount = 0;
  }

  getEntryDelta(entry: Entry): string {
    const sign = entry.type === EntryType.income ? '+' : '-';
    return `${sign} ${this.priceService.convertNumberToEuro(entry.value)}`;
  }

  getDateFromTimestamp(timestamp: number): string {
    const date = this.dateService.getDateFromTimestamp(timestamp);
    const day = this.dateService.getDayShortName(date.getDay());
    return `${date.getDate()}. ${day}`;
  }
}
