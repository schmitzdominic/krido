import { ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../../../services/account/account.service";
import {EntryService} from "../../../services/entry/entry.service";
import {DateService} from "../../../services/date/date.service";
import { Entry } from '../../../../shared/interfaces/entry.model';
import { EntryType } from '../../../../shared/enums/entry-type.enum';
import { combineLatest, forkJoin, map, Subject, take, takeUntil } from 'rxjs';
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
  private cdr = inject(ChangeDetectorRef);
  @ViewChild('addOrEditEntryModal') addOrEditEntryModal: NgbModalRef | undefined;
  @ViewChild('calculatorModal') calculatorModal: TemplateRef<any> | undefined;

  selectedEntry: (Entry & { id: string }) | undefined;
  addOrEditEntryModalRef: NgbModalRef | undefined;
  calculatorModalRef: NgbModalRef | undefined;

  // Calculator state
  calcStartAmount: number = 0;
  calcIsCalculated: boolean = false;
  calcRows: { entry: Entry & { id: string }; delta: number; balance: number }[] = [];
  calcFinalBalance: number = 0;

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
  isFabVisible: boolean = true;

  private lastScrollY: number = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const currentY = window.scrollY;
    this.isFabVisible = currentY <= this.lastScrollY || currentY < 80;
    this.lastScrollY = currentY;
  }

  private _searchTerm: string = '';

  @Input() set searchTerm(value: string) {
    this._searchTerm = value.toLowerCase().replace(/\s+/g, '');
    this.filterAndSortEntries();
  }

  get isSearching(): boolean {
    return this._searchTerm.length > 0;
  }

  get searchResultEntries(): (Entry & { id: string })[] {
    return [...this.actualMonthEntries, ...this.nextMonthEntries];
  }

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.checkForAccounts();
    this.loadEntries();
  }

  loadEntries() {
    const actualMonth$ = this.entryService.getAllEntriesByMonthString(this.dateService.getActualMonthString());
    const nextMonth$ = this.entryService.getAllEntriesByMonthString(this.dateService.getMonthStringFromMonth(1));

    combineLatest([actualMonth$, nextMonth$]).pipe(
      takeUntil(this.destroy$)).
      subscribe(([actualEntries, nextEntries]) => {

      this.allActualMonthEntries = actualEntries;
      this.allNextMonthEntries = nextEntries;
      this.totalActualMonthEntries = actualEntries.length;
      this.totalNextMonthEntries = nextEntries.length;
      this.filterAndSortEntries();
      this.cdr.detectChanges();
      });
  }

  private filterAndSortEntries() {
    let filteredActual = this.isShowAll ? this.allActualMonthEntries : this.allActualMonthEntries.filter(entry => entry.date >= this.dateService.getActualDayTimestamp());
    let filteredNext = this.isShowAll ? this.allNextMonthEntries : this.allNextMonthEntries.filter(entry => entry.date >= this.dateService.getActualDayTimestamp());

    if (this._searchTerm) {
      filteredActual = filteredActual.filter(e => e.searchName.includes(this._searchTerm));
      filteredNext = filteredNext.filter(e => e.searchName.includes(this._searchTerm));
    }

    this.actualMonthEntries = this.sortEntriesByDate(filteredActual);
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

  openCalculatorModal(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.resetCalculator();
    if (this.calculatorModal) {
      this.calculatorModalRef = this.ngbModal.open(this.calculatorModal, { size: 'md' });
    }
  }

  calculateMonth(): void {
    let balance = this.calcStartAmount;
    const nextMonthString = this.dateService.getMonthStringFromMonth(1);
    const sorted = [...this.allNextMonthEntries]
      .filter(e => String(e.monthString) === nextMonthString)
      .sort((a, b) => a.date - b.date);
    this.calcRows = sorted.map(entry => {
      const delta = entry.type === EntryType.income ? entry.value : -entry.value;
      balance += delta;
      return { entry, delta, balance };
    });
    this.calcFinalBalance = balance;
    this.calcIsCalculated = true;
  }

  resetCalculator(): void {
    this.calcStartAmount = 0;
    this.calcIsCalculated = false;
    this.calcRows = [];
    this.calcFinalBalance = 0;
  }

  closeCalculatorModal(): void {
    if (this.calculatorModalRef) {
      this.calculatorModalRef.close();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
