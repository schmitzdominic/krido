import { Component, computed, inject, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {AccountService} from "../../../services/account/account.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import {Account} from "../../../../shared/interfaces/account.model";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../../services/user/user.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-info-area',
    templateUrl: './info-area.component.html',
    styleUrls: ['./info-area.component.scss'],
    standalone: false
})
export class InfoAreaComponent {
  private accountService = inject(AccountService);
  private ngbModal = inject(NgbModal);
  private userService = inject(UserService);

  @ViewChild('updateAccountValueModal') updateAccountValueModal: NgbModalRef | undefined;

  selectedAccount: Account | undefined;
  updateAccountValueModalRef: NgbModalRef | undefined;
  isAccountsExpanded: boolean = localStorage.getItem('accounts-expanded') !== 'false';

  toggleAccountsSection(): void {
    this.isAccountsExpanded = !this.isAccountsExpanded;
    localStorage.setItem('accounts-expanded', String(this.isAccountsExpanded));
  }

  private readonly allGiroAccounts = toSignal(
    this.accountService.getAllAccountsFilteredByAccountType(AccountType.giro).pipe(
      map(accounts => accounts as (Account & { id: string })[])
    ),
    { initialValue: [] as (Account & { id: string })[] }
  );

  readonly accounts = computed(() =>
    this.allGiroAccounts().filter(
      account => account.id === (this.userService.mainAccount as any)?.id
    )
  );

  openUpdateAccountValueModal(): void {
    (document.activeElement as HTMLElement)?.blur();
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
