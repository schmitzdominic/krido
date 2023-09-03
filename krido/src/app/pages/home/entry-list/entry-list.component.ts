import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent {

  @Output() isEntriesAvailable: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('addOrEditEntryModal') addOrEditEntryModal: NgbModalRef | undefined;

  addOrEditEntryModalRef: NgbModalRef | undefined;

  constructor(private ngbModal: NgbModal) {
  }

  ngOnInit() {
    this.isEntriesAvailable.emit(false);
  }

  openAddOrEditEntryModal(): void {
    this.addOrEditEntryModalRef = this.ngbModal.open(
      this.addOrEditEntryModal,
      {
        size: 'sm'
      });
  }

  onCloseAddOrEditEntryModal(): void {
    if (this.addOrEditEntryModalRef) {
      this.addOrEditEntryModalRef.close();
    }
  }

  onButtonAddClick() {
    this.openAddOrEditEntryModal();
  }

}
