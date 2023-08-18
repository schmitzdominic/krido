import {Component, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent {

  @ViewChild('addBudgetModal') addBudgetModal: NgbModalRef | undefined;

  addBudgetModalRef: NgbModalRef | undefined;

  constructor(private ngbModal: NgbModal) {
  }

  onAddClick(): void {
    this.openAddBudgetModal();
  }

  openAddBudgetModal(): void {
    this.addBudgetModalRef = this.ngbModal.open(
      this.addBudgetModal,
      {
        centered: true,
        size: 'sm'
      });
  }

  onCloseAddBudgetModal(): void {
    if (this.addBudgetModalRef) {
      this.addBudgetModalRef.close();
    }
  }

}
