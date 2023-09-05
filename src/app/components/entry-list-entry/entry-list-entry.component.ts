import {Component, Input} from '@angular/core';
import {Entry} from "../../../shared/interfaces/entry.model";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {PriceService} from "../../services/price/price.service";
import {DateService} from "../../services/date/date.service";
import {EntryType} from "../../../shared/enums/entry-type.enum";

@Component({
  selector: 'app-entry-list-entry',
  templateUrl: './entry-list-entry.component.html',
  styleUrls: ['./entry-list-entry.component.scss']
})
export class EntryListEntryComponent {

  @Input() entry: Entry | undefined;

  protected readonly AccountType = AccountType;

  constructor(public priceService: PriceService,
              public dateService: DateService) {
  }

  ngOnInit() {
  }

  getPrice(entry: Entry) {
    return `${entry.type === EntryType.outcome ? '-' : ''} ${this.priceService.convertNumberToEuro(entry!.value)}`
  }

  getDateFromTimestamp(timestamp: number): string {
    const date: Date = this.dateService.getDateFromTimestamp(timestamp);
    const dayShort: string = this.dateService.getDayShortName(date.getDay())
    return `${date.getDate()}. ${dayShort}`
  }

  protected readonly EntryType = EntryType;
}
