import { Component, computed, inject, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Account} from "../../../../shared/interfaces/account.model";
import {AccountService} from "../../../services/account/account.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import {PriceService} from "../../../services/price/price.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-accounts-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.scss'],
    standalone: false
})
export class AccountListComponent {
  private ngbModal = inject(NgbModal);
  private accountService = inject(AccountService);
  priceService = inject(PriceService);


  @ViewChild('addOrEditAccountModal') addOrEditAccountModal: NgbModalRef | undefined;
  @ViewChild('viewAccountModal') viewAccountModal: NgbModalRef | undefined;

  protected readonly AccountType = AccountType;

  selectedAccount: (Account & { id: string }) | undefined;

  addOrEditAccountModalRef: NgbModalRef | undefined;
  viewAccountModalRef: NgbModalRef | undefined;

  readonly accounts = toSignal(
    this.accountService.getAllAccounts().pipe(
      map(accounts => accounts as (Account & { id: string })[])
    )
  );

  readonly isInitialized = computed(() => this.accounts() !== undefined);

  onClickAccount(account: Account & { id: string }) {
    this.selectedAccount = account;
    this.openViewAccountModal();
  }

  openAddOrEditAccountModal(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.addOrEditAccountModalRef = this.ngbModal.open(
      this.addOrEditAccountModal,
      {
        size: 'md'
      });
  }

  openViewAccountModal(): void {
    (document.activeElement as HTMLElement)?.blur();
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
