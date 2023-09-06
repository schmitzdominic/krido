import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../../../services/account/account.service";
import {EntryService} from "../../../services/entry/entry.service";
import {DateService} from "../../../services/date/date.service";
import {Entry} from "../../../../shared/interfaces/entry.model";
import {LoadingService} from "../../../services/loading/loading.service";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent {

  @Output() isEntriesAvailable: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('addOrEditEntryModal') addOrEditEntryModal: NgbModalRef | undefined;

  selectedEntry: Entry | undefined;

  addOrEditEntryModalRef: NgbModalRef | undefined;

  actualMonthName: string = this.dateService.getActualMonthName();
  nextMonthName: string = this.dateService.getMonthName(this.dateService.getMonthStringFromMonth(1));

  actualMonthEntries: Entry[] = [];
  nextMonthEntries: Entry[] = [];

  isAccountAvailable: boolean = false;
  isToastNoAccountShown: boolean = false;
  isNoEntriesThisMonth: boolean = true;
  isShowAll: boolean = false;

  loadedLists: number = 0;
  endLoadingOnList: number = 2;

  constructor(private ngbModal: NgbModal,
              private accountService: AccountService,
              private entryService: EntryService,
              private dateService: DateService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.isEntriesAvailable.emit(false);
    this.checkForAccounts();
    this.loadEntries();
  }

  loadEntries() {
    this.loadingService.setLoading = true;
    this.loadedLists = 0;
    this.loadMonthEntries(this.dateService.getActualMonthString(), this.actualMonthEntries);
    this.loadMonthEntries(this.dateService.getMonthStringFromMonth(1), this.nextMonthEntries);
  }

  loadMonthEntries(monthString: string, entryList: Entry[]) {
    this.entryService.getAllEntriesByMonthString(monthString).subscribe(entries => {
      entryList.length = 0;
      entries.forEach(entryRaw => {
        const entry: Entry = entryRaw.payload.val() as Entry;
        entry.key = entryRaw.key ? entryRaw.key : '';
        this.pushEntryToList(entry, entryList);
      });
      this.sortEntriesByDate(entryList);
      if (++this.loadedLists == this.endLoadingOnList) {this.loadingService.setLoading = false;}
    });
  }

  private pushEntryToList(entry: Entry, entries: Entry[]) {
    if (this.isShowAll) {
      entries.push(entry);
    } else {
      if (entry.date >= this.dateService.getActualDayTimestamp()) {
        entries.push(entry);
      }
    }
  }

  private sortEntriesByDate(entries: Entry[]) {
    entries.sort((one, two) => {
      return one.date < two.date ? -1 : 1;
    });
  }

  checkForAccounts() {
    this.accountService.getAllAccounts().subscribe(accounts => {
      this.isAccountAvailable = accounts.length > 0;
      this.isToastNoAccountShown = !this.isAccountAvailable;
    });
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

  onButtonAddClick() {
    this.openAddOrEditEntryModal();
  }

  onButtonShowAllClick() {
    this.isShowAll = !this.isShowAll;
    this.loadEntries();
  }

}
