import {Component, ViewChild} from '@angular/core';
import {AccountService} from "../../../services/account/account.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import {Account} from "../../../../shared/interfaces/account.model";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-info-area',
  templateUrl: './info-area.component.html',
  styleUrls: ['./info-area.component.scss']
})
export class InfoAreaComponent {

  @ViewChild('updateAccountValueModal') updateAccountValueModal: NgbModalRef | undefined;

  selectedAccount: Account | undefined;

  updateAccountValueModalRef: NgbModalRef | undefined;

  accounts: Account[] = [];

  constructor(private accountService: AccountService,
              private ngbModal: NgbModal,
              private userService: UserService) {
    this.loadGiroAccounts();
  }

  loadGiroAccounts() {
    this.accountService.getAllAccountsFilteredByAccountType(AccountType.giro).subscribe(accounts => {
      this.accounts.length = 0;
      if (this.userService.mainAccount) {
        accounts.forEach(accountsRaw => {
          const account: Account = accountsRaw.payload.val() as Account;
          account.key = accountsRaw.key ? accountsRaw.key : '';
          if (account.key === this.userService.mainAccount!.key) {
            this.accounts.push(account);
          }
        });
      }
    });
  }

  openUpdateAccountValueModal(): void {
    this.updateAccountValueModalRef = this.ngbModal.open(
      this.updateAccountValueModal,
      {
        size: 'md'
      });
  }

  onCloseUpdateAccountValueModal() {
    if (this.updateAccountValueModalRef) {
      this.updateAccountValueModalRef.close();
      this.selectedAccount = undefined;
    }
  }

  onAccountClick(account: Account) {
    this.selectedAccount = account;
    this.openUpdateAccountValueModal();
  }
}
