import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../../../services/account/account.service";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent {

  @Output() isEntriesAvailable: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('addOrEditEntryModal') addOrEditEntryModal: NgbModalRef | undefined;

  addOrEditEntryModalRef: NgbModalRef | undefined;

  isAccountAvailable: boolean = false;
  isToastNoAccountShown: boolean = false;

  constructor(private ngbModal: NgbModal,
              private accountService: AccountService) {
  }

  ngOnInit() {
    this.isEntriesAvailable.emit(false);
    this.checkForAccounts();
  }

  checkForAccounts() {
    this.accountService.getAllAccounts().subscribe(accounts => {
      this.isAccountAvailable = accounts.length > 0;
      this.isToastNoAccountShown = !this.isAccountAvailable;
    });
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
