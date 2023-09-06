import {Component, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Account} from "../../../../shared/interfaces/account.model";
import {AccountService} from "../../../services/account/account.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import {PriceService} from "../../../services/price/price.service";
import {LoadingService} from "../../../services/loading/loading.service";

@Component({
  selector: 'app-accounts-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {

  @ViewChild('addOrEditAccountModal') addOrEditAccountModal: NgbModalRef | undefined;
  @ViewChild('viewAccountModal') viewAccountModal: NgbModalRef | undefined;

  protected readonly AccountType = AccountType;

  selectedAccount: Account | undefined;

  addOrEditAccountModalRef: NgbModalRef | undefined;
  viewAccountModalRef: NgbModalRef | undefined;

  isInitialized: boolean = false;

  accounts: Account[] = [];

  constructor(private ngbModal: NgbModal,
              private accountService: AccountService,
              private loadingService: LoadingService,
              public priceService: PriceService) {
  }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loadingService.setLoading = true;
    this.accountService.getAllAccounts().subscribe(accounts => {
      this.accounts = [];
      accounts.forEach(accountRaw => {
        let account: Account = accountRaw.payload.val() as Account;
        if (accountRaw.key) account.key = accountRaw.key;
        this.accounts.push(account);
      });
      this.loadingService.setLoading = false;
      this.isInitialized = true;
    });
  }

  onClickAccount(account: Account) {
    this.selectedAccount = account;
    this.openViewAccountModal();
  }

  openAddOrEditAccountModal(): void {
    this.addOrEditAccountModalRef = this.ngbModal.open(
      this.addOrEditAccountModal,
      {
        size: 'md'
      });
  }

  openViewAccountModal(): void {
    this.viewAccountModalRef = this.ngbModal.open(
      this.viewAccountModal,
      {
        size: 'md'
      });
  }

  onCloseAddOrEditAccountModal(): void {
    if (this.addOrEditAccountModalRef) {
      this.addOrEditAccountModalRef.close();
    }
  }

  onCloseViewAccountModal(): void {
    if (this.viewAccountModalRef) {
      this.viewAccountModalRef.close();
    }
  }

  onButtonAddClick() {
    this.openAddOrEditAccountModal();
  }
}
