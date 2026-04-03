import { Component, computed, effect, inject, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Account} from "../../../../shared/interfaces/account.model";
import {AccountService} from "../../../services/account/account.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import {PriceService} from "../../../services/price/price.service";
import {LoadingService} from "../../../services/loading/loading.service";
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
  private loadingService = inject(LoadingService);
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

  constructor() {
    this.loadingService.setLoading = true;
    effect(() => {
      if (this.accounts() !== undefined) {
        this.loadingService.setLoading = false;
      }
    });
  }

  onClickAccount(account: Account & { id: string }) {
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
