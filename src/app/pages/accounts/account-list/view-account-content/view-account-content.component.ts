import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {Account} from "../../../../../shared/interfaces/account.model";
import {AccountType} from "../../../../../shared/enums/account-type.enum";
import {PriceService} from "../../../../services/price/price.service";
import {AccountService} from "../../../../services/account/account.service";
import { take } from 'rxjs/operators';

export type AccountViewMode = 'view' | 'edit' | 'updateBalance';

@Component({
    selector: 'app-view-account-content',
    templateUrl: './view-account-content.component.html',
    styleUrls: ['./view-account-content.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAccountContentComponent {
  priceService = inject(PriceService);
  private accountService = inject(AccountService);
  private cdr = inject(ChangeDetectorRef);


  @Input() account: (Account & { id: string }) | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  mode: AccountViewMode = 'view';

  get isContentReadOnly(): boolean { return this.mode === 'view'; }
  get isEditButtonShown(): boolean { return this.mode === 'view'; }

  onButtonEdit() {
    this.mode = 'edit';
  }

  onButtonUpdateBalance() {
    this.mode = 'updateBalance';
  }

  onButtonCancel() {
    if (this.mode === 'updateBalance') {
      // Reload the account so the updated balance is visible immediately
      if (this.account?.id) {
        this.accountService.getAccountById(this.account.id).pipe(take(1)).subscribe(updated => {
          if (updated) {
            this.account = { ...updated, id: this.account!.id };
          }
          this.mode = 'view';
          this.cdr.markForCheck();
        });
      } else {
        this.mode = 'view';
      }
    } else if (this.mode === 'edit') {
      if (this.account?.id) {
        this.accountService.getAccountById(this.account.id).pipe(take(1)).subscribe(updated => {
          if (updated) {
            this.account = { ...updated, id: this.account!.id };
          }
          this.mode = 'view';
          this.cdr.markForCheck();
        });
      } else {
        this.mode = 'view';
      }
    } else {
      this.onClose.emit();
    }
  }

  protected readonly AccountType = AccountType;
}
