import {Component, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-accounts-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {

  @ViewChild('addOrEditAccountModal') addOrEditAccountModal: NgbModalRef | undefined;

  addOrEditAccountModalRef: NgbModalRef | undefined;

  constructor(private ngbModal: NgbModal) {
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

}
