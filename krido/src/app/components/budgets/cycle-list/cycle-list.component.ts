import {Component, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-cycle-list',
  templateUrl: './cycle-list.component.html',
  styleUrls: ['./cycle-list.component.scss']
})
export class CycleListComponent {

  @ViewChild('addCycleModal') addCycleModal: NgbModalRef | undefined;

  addCycleModalRef: NgbModalRef | undefined;

  constructor(private ngbModal: NgbModal) {
  }

  onAddClick(): void {
    this.openAddCycleModal();
  }

  openAddCycleModal(): void {
    this.addCycleModalRef = this.ngbModal.open(
      this.addCycleModal,
      {
        size: 'sm'
      });
  }

  onCloseAddCycleModal(): void {
    if (this.addCycleModalRef) {
      this.addCycleModalRef.close();
    }
  }

}
