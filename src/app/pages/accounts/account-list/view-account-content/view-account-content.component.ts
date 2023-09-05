import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Account} from "../../../../../shared/interfaces/account.model";
import {AccountType} from "../../../../../shared/enums/account-type.enum";
import {PriceService} from "../../../../services/price/price.service";

@Component({
  selector: 'app-view-account-content',
  templateUrl: './view-account-content.component.html',
  styleUrls: ['./view-account-content.component.scss']
})
export class ViewAccountContentComponent {

  @Input() account: Account | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  isContentReadOnly: boolean = true;
  isEditButtonShown: boolean = true;

  constructor(public priceService: PriceService) {
  }

  onButtonEdit() {
    this.isContentReadOnly = !this.isContentReadOnly;
  }

  onButtonCancel() {
    this.onClose.emit();
  }

  protected readonly AccountType = AccountType;
}
