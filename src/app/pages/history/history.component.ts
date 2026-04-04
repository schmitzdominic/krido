import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AccountService} from "../../services/account/account.service";
import {Account} from "../../../shared/interfaces/account.model";
import {HistorySearchObject} from "./history-list/history-list.component";
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

  /** A stream of all available accounts. */
  accounts: (Account & { id: string })[] = [];
  historySearchObject: HistorySearchObject = {
    searchValue: '',
    account: undefined,
    isLastMonth: false
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

  /** Handles the click event for the "Last Month" button. */
  onClickLastMonth(): void {
    this.historySearchObject = this.getHistorySearchObject('', this.historySearchObject.account, !this.historySearchObject.isLastMonth);
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
      if (searchValue.length > 2) {
        this.historySearchObject = this.getHistorySearchObject(searchValue, undefined, false);
      }
    });
    this.searchFormGroup.controls['accounts'].valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      const account = this.accounts.find(account => account.id === value);
      this.historySearchObject = this.getHistorySearchObject('', account, this.historySearchObject.isLastMonth);
    });
  }
  /** Sets initial page values like the title. */
  private setInitialValues(): void {
    this.menuTitleService.setTitle('Historie');
    this.menuTitleService.setActiveId(3);
  }

  /** Loads all accounts from the service. */
  private loadAccounts(): void {
    this.accountService.getAllAccounts().pipe(
      map(accounts => accounts as (Account & { id: string })[]),
      takeUntil(this.destroy$)
    ).subscribe(allAccounts => this.accounts = allAccounts);
  }

  getHistorySearchObject(searchValue: string = '', account: Account | undefined = undefined, isLastMonth: boolean = false) {
    return {
      searchValue: searchValue,
      account: account,
      isLastMonth: isLastMonth
    } as HistorySearchObject;
  }
}
