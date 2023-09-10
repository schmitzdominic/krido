import {Component, Input} from '@angular/core';
import {EntryType} from "../../../shared/enums/entry-type.enum";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {Regularly} from "../../../shared/interfaces/regularly.model";
import {PriceService} from "../../services/price/price.service";
import {DateService} from "../../services/date/date.service";
import {RegularlyCycleType} from "../../../shared/enums/regularly-cycle-type.enum";

@Component({
  selector: 'app-regularly-list-entry',
  templateUrl: './regularly-list-entry.component.html',
  styleUrls: ['./regularly-list-entry.component.scss']
})
export class RegularlyListEntryComponent {

  @Input() regularly: Regularly | undefined;

  protected readonly EntryType = EntryType;
  protected readonly AccountType = AccountType;

  constructor(public priceService: PriceService,
              public dateService: DateService) {
  }

  ngOnInit() {
  }

  getPrice(regularly: Regularly) {
    return `${regularly.entryType === EntryType.outcome ? '-' : ''} ${this.priceService.convertNumberToEuro(regularly!.value)}`
  }

  getDateFromTimestamp(timestamp: number): string {
    const date: Date = this.dateService.getDateFromTimestamp(timestamp);
    const monthShort: string = this.dateService.getMonthShortName(date.getMonth());
    return `${date.getDate()}. ${this.regularly?.cycle === RegularlyCycleType.year ? monthShort : ''}`
  }

  get dayOfMonth(): string {
    if (this.regularly?.cycle === RegularlyCycleType.month || this.regularly?.cycle === RegularlyCycleType.quarter) {
      if (this.regularly.isEndOfMonth) {
        return 'letzter Tag';
      } else {
        return this.regularly.monthDay + '.';
      }
    } else {
      return '';
    }
  }

  protected readonly RegularlyCycleType = RegularlyCycleType;
}
