import { Component } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AccountService} from "../../services/account/account.service";
import {Account} from "../../../shared/interfaces/account.model";
import {HistorySearchObject} from "./history-list/history-list.component";

@Component({
  selector: 'app-expenditures',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  accounts: Account[] = [];
  historySearchObject: HistorySearchObject = {
    searchValue: '',
    account: undefined,
    isLastMonth: false
  };

  searchFormGroup: FormGroup = new FormGroup({
    search: new FormControl(''),
    accounts: new FormControl('')
  });

  constructor(private menuTitleService: MenuTitleService,
              private formBuilder: FormBuilder,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
    this.createFormGroup();
    this.createListeners();
    this.loadAccounts();
  }

  createFormGroup(): void {
    this.searchFormGroup = this.formBuilder.group(
      {
        search: [''],
        accounts: ['']
      }
    );
  }

  createListeners() {
    this.searchFormGroup.controls['search'].valueChanges.subscribe(searchValue => {
      if (searchValue.length > 3) {
        this.historySearchObject = this.getHistorySearchObject();
      }
      this.historySearchObject = this.getHistorySearchObject(searchValue, undefined, false);
    });
    this.searchFormGroup.controls['accounts'].valueChanges.subscribe(value => {
      const account: Account = this.accounts.filter(account => account.key === value)[0];
      this.historySearchObject = this.getHistorySearchObject('', account, this.historySearchObject.isLastMonth);
    });
  }

  onClickLastMonth() {
    this.historySearchObject = this.getHistorySearchObject('', this.historySearchObject.account, !this.historySearchObject.isLastMonth);
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Historie');
    this.menuTitleService.setActiveId(3);
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe(allAccounts => {
      allAccounts.forEach(accountObject => {
        const account: Account = accountObject.payload.val() as Account;
        account.key = accountObject.key ? accountObject.key : '';
        this.accounts.push(account);
      });
    });
  }

  getHistorySearchObject(searchValue: string = '', account: Account | undefined = undefined, isLastMonth: boolean = false) {
    return {
      searchValue: searchValue,
      account: account,
      isLastMonth: isLastMonth
    } as HistorySearchObject;
  }
}
