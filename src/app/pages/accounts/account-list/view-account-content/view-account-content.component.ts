import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {Account} from "../../../../../shared/interfaces/account.model";
import {AccountType} from "../../../../../shared/enums/account-type.enum";
import {PriceService} from "../../../../services/price/price.service";

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

  isContentReadOnly: boolean = true;
  isEditButtonShown: boolean = true;

  onButtonEdit() {
    this.isContentReadOnly = !this.isContentReadOnly;
  }

  onButtonCancel() {
    this.onClose.emit();
  }

  protected readonly AccountType = AccountType;
}
