import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../../../services/account/account.service";
import {EntryService} from "../../../services/entry/entry.service";
import {DateService} from "../../../services/date/date.service";
import {Entry} from "../../../../shared/interfaces/entry.model";
import { combineLatest, forkJoin, asapScheduler, map, observeOn, Subject, take, takeUntil } from 'rxjs';
import { Account } from '../../../../shared/interfaces/account.model';

@Component({
    selector: 'app-entry-list',
    templateUrl: './entry-list.component.html',
    styleUrls: ['./entry-list.component.scss'],
    standalone: false
})
export class EntryListComponent implements OnInit, OnDestroy {
  private ngbModal = inject(NgbModal);
  private accountService = inject(AccountService);
  private entryService = inject(EntryService);
  private dateService = inject(DateService);
  @ViewChild('addOrEditEntryModal') addOrEditEntryModal: NgbModalRef | undefined;

  selectedEntry: (Entry & { id: string }) | undefined;

  addOrEditEntryModalRef: NgbModalRef | undefined;

  actualMonthName: string = this.dateService.getActualMonthName();
  nextMonthName: string = this.dateService.getMonthName(this.dateService.getMonthStringFromMonth(1));

  actualMonthEntries: (Entry & { id: string })[] = [];
  nextMonthEntries: (Entry & { id: string })[] = [];

  private allActualMonthEntries: (Entry & { id: string })[] = [];
  private allNextMonthEntries: (Entry & { id: string })[] = [];

  totalActualMonthEntries: number = -1;
  totalNextMonthEntries: number = -1;

  isAccountAvailable: boolean = false;
  isToastNoAccountShown: boolean = false;
  isShowAll: boolean = false;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.checkForAccounts();
    this.loadEntries();
  }

  loadEntries() {
    const actualMonth$ = this.entryService.getAllEntriesByMonthString(this.dateService.getActualMonthString());
    const nextMonth$ = this.entryService.getAllEntriesByMonthString(this.dateService.getMonthStringFromMonth(1));

    combineLatest([actualMonth$, nextMonth$]).pipe(
      observeOn(asapScheduler),
      takeUntil(this.destroy$)).
      subscribe(([actualEntries, nextEntries]) => {

      this.allActualMonthEntries = actualEntries;
      this.allNextMonthEntries = nextEntries;
      this.totalActualMonthEntries = actualEntries.length;
      this.totalNextMonthEntries = nextEntries.length;
      this.filterAndSortEntries();
      });
  }

  private filterAndSortEntries() {
    const filteredActual = this.isShowAll ? this.allActualMonthEntries : this.allActualMonthEntries.filter(entry => entry.date >= this.dateService.getActualDayTimestamp());
    this.actualMonthEntries = this.sortEntriesByDate(filteredActual);

    const filteredNext = this.isShowAll ? this.allNextMonthEntries : this.allNextMonthEntries.filter(entry => entry.date >= this.dateService.getActualDayTimestamp());
    this.nextMonthEntries = this.sortEntriesByDate(filteredNext);
  }

  private sortEntriesByDate(entries: (Entry & { id: string })[]) {
    // Create a new array to avoid mutating the original one
    return [...entries].sort((one, two) => {
      return one.date < two.date ? -1 : 1;
    });
  }

  checkForAccounts() {
    this.accountService.getAllAccounts().pipe(
      takeUntil(this.destroy$)).
      subscribe(accounts => {
      this.isAccountAvailable = accounts.length > 0;
      this.isToastNoAccountShown = !this.isAccountAvailable;
    });
  }

  openAddOrEditEntryModal(): void {
    (document.activeElement as HTMLElement)?.blur();
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

  onEntryClick(entry: Entry & { id: string }) {
    this.selectedEntry = entry;
    this.openAddOrEditEntryModal();
  }

  onButtonAddClick() {
    this.openAddOrEditEntryModal();
  }

  onButtonShowAllClick() {
    this.isShowAll = !this.isShowAll;
    this.filterAndSortEntries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
