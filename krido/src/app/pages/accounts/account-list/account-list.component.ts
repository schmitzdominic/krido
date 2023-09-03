import {Component, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Account} from "../../../../shared/interfaces/account.model";
import {AccountService} from "../../../services/account/account.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";

@Component({
  selector: 'app-accounts-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {

  @ViewChild('addOrEditAccountModal') addOrEditAccountModal: NgbModalRef | undefined;

  addOrEditAccountModalRef: NgbModalRef | undefined;

  accounts: Account[] = [];

  constructor(private ngbModal: NgbModal,
              private accountService: AccountService) {
  }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAllAccounts().subscribe(accounts => {
      this.accounts = [];
      accounts.forEach(accountRaw => {
        const account: Account = accountRaw.payload.val() as Account;
        this.accounts.push(account);
      });
    });
  }

  openAddOrEditAccountModal(): void {
    this.addOrEditAccountModalRef = this.ngbModal.open(
      this.addOrEditAccountModal,
      {
        size: 'sm'
      });
  }

  onCloseAddOrEditAccountModal(): void {
    if (this.addOrEditAccountModalRef) {
      this.addOrEditAccountModalRef.close();
    }
  }

  onButtonAddClick() {
    this.openAddOrEditAccountModal();
  }

  protected readonly AccountType = AccountType;
}
