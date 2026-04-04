import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {Account} from "../../../../../shared/interfaces/account.model";
import {AccountType} from "../../../../../shared/enums/account-type.enum";
import {PriceService} from "../../../../services/price/price.service";

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
    if (this.mode !== 'view') {
      this.mode = 'view';
    } else {
      this.onClose.emit();
    }
  }

  protected readonly AccountType = AccountType;
}
