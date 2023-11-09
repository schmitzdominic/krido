import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {EntryService} from "../../../services/entry/entry.service";
import {HelperService} from "../../../services/helper/helper.service";
import {Entry} from "../../../../shared/interfaces/entry.model";
import {DateService} from "../../../services/date/date.service";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Account} from "../../../../shared/interfaces/account.model";

export interface HistorySearchObject {
  searchValue: string,
  account: Account | undefined,
  isLastMonth: boolean
}

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent {

  @Input() historySearchObject: HistorySearchObject | undefined;

  @ViewChild('addOrEditEntryModal') addOrEditEntryModal: NgbModalRef | undefined;

  title: string = '';

  addOrEditEntryModalRef: NgbModalRef | undefined;

  entries: Entry[] = [];

  selectedEntry: Entry | undefined;

  constructor(private entryService: EntryService,
              private helperService: HelperService,
              private dateService: DateService,
              private ngbModal: NgbModal) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    this.historySearchObject = changes['historySearchObject']?.currentValue;

    if (this.historySearchObject!.searchValue.length > 3) {
      this.search(this.historySearchObject!.searchValue, this.historySearchObject!.account);
    } else {
      if (this.historySearchObject!.isLastMonth) {
        this.loadLastMonth(this.historySearchObject!.account);
      } else {
        this.entries.length = 0;
      }
    }
  }

  search(value: string, account: Account | undefined = undefined) {
    this.title = 'Ergebnisse'
    this.entryService.searchEntriesByName(this.helperService.createSearchName(value)).subscribe(results => {
      this.entries.length = 0;
      results.filter(entry => (entry.payload.val() as Entry).searchName.includes(this.helperService.createSearchName(value))).forEach(result => {
        const entry: Entry = result.payload.val() as Entry;
        entry.key = result.key ? result.key : '';
        this.entries.push(entry);
      });
      if (this.entries.length === 0) {
        this.title = 'Nichts gefunden!'
      } else {
        if (account) {
          this.filterEntriesByAccount(account);
        }
        this.sortEntriesByDate(this.entries);
      }
    });
  }

  private sortEntriesByDate(entries: Entry[]) {
    entries.sort((one, two) => {
      return one.date > two.date ? -1 : 1;
    });
  }

  loadLastMonth(account: Account | undefined = undefined) {
    const lastMonthString: string = this.dateService.getMonthStringFromMonth(-1);
    this.title = `${this.dateService.getMonthName(lastMonthString)} ${this.dateService.getYear(lastMonthString)}`;
    this.entryService.searchEntriesByMonthString(lastMonthString).subscribe(results => {
      this.entries.length = 0;
      results.filter(entry => (entry.payload.val() as Entry).monthString.includes(lastMonthString)).forEach(result => {
        const entry: Entry = result.payload.val() as Entry;
        entry.key = result.key ? result.key : '';
        this.entries.push(entry);
      });
      if (account) {
        this.filterEntriesByAccount(account);
      }
    });
  }

  filterEntriesByAccount(account: Account) {
    this.entries = this.entries.filter(entry => entry.account.key == account.key);
  }

  openAddOrEditEntryModal(): void {
    this.addOrEditEntryModalRef = this.ngbModal.open(
      this.addOrEditEntryModal,
      {
        size: 'md'
      });
  }

  onCloseAddOrEditEntryModal(): void {
    if (this.addOrEditEntryModalRef) {
      this.addOrEditEntryModalRef.close();
      this.selectedEntry = undefined;
    }
  }

  onEntryClick(entry: Entry) {
    this.selectedEntry = entry;
    this.openAddOrEditEntryModal();
  }
}
