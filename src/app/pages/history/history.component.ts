import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AccountService} from "../../services/account/account.service";
import {Account} from "../../../shared/interfaces/account.model";
import {HistorySearchObject} from "./history-list/history-list.component";
import {EntryService} from "../../services/entry/entry.service";
import {DateService} from "../../services/date/date.service";
import { map, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-expenditures',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    standalone: false
})
/**
 * @Component HistoryComponent
 * Manages the search and filter controls for the history page.
 * It constructs a search object and passes it to the `HistoryListComponent`.
 */
export class HistoryComponent implements OnInit, OnDestroy {
  private menuTitleService = inject(MenuTitleService);
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private entryService = inject(EntryService);
  public dateService = inject(DateService);

  /** A stream of all available accounts. */
  accounts: (Account & { id: string })[] = [];
  availableMonths: string[] = [];
  historySearchObject: HistorySearchObject = {
    searchValue: '',
    account: undefined,
    selectedMonth: null
  };

  /** The form group for search and account selection. */
  searchFormGroup: FormGroup = new FormGroup({
    search: new FormControl(''),
    accounts: new FormControl('')
  });

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setInitialValues();
    this.searchFormGroup = this.createFormGroup();
    this.createListeners();
    this.loadAccounts();
    this.loadAvailableMonths();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get selectedAccountName(): string {
    const id = this.searchFormGroup.value.accounts;
    if (!id) return 'Alle Konten';
    const account = this.accounts.find(a => a.id === id);
    return account ? account.name : 'Alle Konten';
  }

  /** Handles month selection from the dropdown. */
  onSelectMonth(monthString: string): void {
    const newMonth = this.historySearchObject.selectedMonth === monthString ? null : monthString;
    this.historySearchObject = this.getHistorySearchObject(this.historySearchObject.searchValue, this.historySearchObject.account, newMonth);
  }

  /** Creates the form group for the search controls. */
  private createFormGroup(): FormGroup {
    return this.formBuilder.group({
      search: [''],
      accounts: ['']
    });
  }

  createListeners() {
    this.searchFormGroup.controls['search'].valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(searchValue => {
      this.historySearchObject = this.getHistorySearchObject(searchValue, this.historySearchObject.account, this.historySearchObject.selectedMonth);
    });
    this.searchFormGroup.controls['accounts'].valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      const account = this.accounts.find(account => account.id === value);
      this.historySearchObject = this.getHistorySearchObject(this.historySearchObject.searchValue, account, this.historySearchObject.selectedMonth);
    });
  }
  /** Sets initial page values like the title. */
  private setInitialValues(): void {
    this.menuTitleService.setTitle('Suche');
    this.menuTitleService.setActiveId(3);
  }

  /** Loads all accounts from the service. */
  private loadAccounts(): void {
    this.accountService.getAllAccounts().pipe(
      map(accounts => accounts as (Account & { id: string })[]),
      takeUntil(this.destroy$)
    ).subscribe(allAccounts => this.accounts = allAccounts);
  }

  /** Loads all months that have entries, ensuring current month is included. */
  private loadAvailableMonths(): void {
    this.entryService.getAvailableMonthStrings().pipe(
      takeUntil(this.destroy$)
    ).subscribe(months => {
      const currentMonth = this.dateService.getActualMonthString();
      const set = new Set([currentMonth, ...months]);
      this.availableMonths = [...set].sort((a, b) => b > a ? 1 : -1);
    });
  }

  getHistorySearchObject(searchValue: string = '', account: Account | undefined = undefined, selectedMonth: string | null = null) {
    return {
      searchValue: searchValue,
      account: account,
      selectedMonth: selectedMonth
    } as HistorySearchObject;
  }

  get isFilterActive(): boolean {
    return this.historySearchObject.searchValue.length > 0
      || !!this.historySearchObject.account
      || !!this.historySearchObject.selectedMonth;
  }

  resetFilters(): void {
    this.searchFormGroup.controls['search'].setValue('', { emitEvent: false });
    this.searchFormGroup.controls['accounts'].setValue('', { emitEvent: false });
    this.historySearchObject = this.getHistorySearchObject();
  }
}
