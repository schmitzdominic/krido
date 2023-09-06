import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../../../services/account/account.service";
import {EntryService} from "../../../services/entry/entry.service";
import {DateService} from "../../../services/date/date.service";
import {Entry} from "../../../../shared/interfaces/entry.model";

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

  actualMonthEntries: Entry[] = [];
  nextMonthEntries: Entry[] = [];

  isAccountAvailable: boolean = false;
  isToastNoAccountShown: boolean = false;
  isNoEntriesThisMonth: boolean = true;

  constructor(private ngbModal: NgbModal,
              private accountService: AccountService,
              private entryService: EntryService,
              private dateService: DateService) {
  }

  ngOnInit() {
    this.isEntriesAvailable.emit(false);
    this.checkForAccounts();
    this.loadEntries();
  }

  loadEntries() {
    this.loadMonthEntries(this.dateService.getActualMonthString(), this.actualMonthEntries);
    this.loadMonthEntries(this.dateService.getMonthStringFromMonth(1), this.nextMonthEntries);
  }

  loadMonthEntries(monthString: string, entryList: Entry[]) {
    this.entryService.getAllEntriesByMonthString(monthString).subscribe(entries => {
      entryList.length = 0;
      entries.forEach(entryRaw => {
        const entry: Entry = entryRaw.payload.val() as Entry;
        entry.key = entryRaw.key ? entryRaw.key : '';
        entryList.push(entry);
      });
      this.sortEntriesByDate(entryList);
    });
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
        size: 'sm'
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

}
