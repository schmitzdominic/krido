import {Component, ViewChild} from '@angular/core';
import {Regularly} from "../../../../shared/interfaces/regularly.model";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RegularlyType} from "../../../../shared/enums/regularly-type.enum";
import {RegularlyService} from "../../../services/regularly/regularly.service";
import {RegularlyCycleType} from "../../../../shared/enums/regularly-cycle-type.enum";

@Component({
  selector: 'app-regularly-list',
  templateUrl: './regularly-list.component.html',
  styleUrls: ['./regularly-list.component.scss']
})
export class RegularlyListComponent {

  @ViewChild('addOrEditRegularlyModal') addOrEditRegularlyModal: NgbModalRef | undefined;

  addOrEditRegularlyModalRef: NgbModalRef | undefined;

  monthRegularities: Regularly[] = [];
  quarterRegularities: Regularly[] = [];
  yearRegularities: Regularly[] = [];

  constructor(private ngbModal: NgbModal,
              private regularlyService: RegularlyService) {
  }

  ngOnInit() {
    this.loadMonth();
    this.loadQuarter();
    this.loadYear();
  }

  loadMonth() {
    this.loadRegularities(RegularlyCycleType.month, this.monthRegularities);
  }

  loadQuarter() {
    this.loadRegularities(RegularlyCycleType.quarter, this.quarterRegularities);
  }

  loadYear() {
    this.loadRegularities(RegularlyCycleType.year, this.yearRegularities);
  }

  loadRegularities(regularlyCycleType: RegularlyCycleType, list: Regularly[]) {
    this.regularlyService.getAllByCycleType(regularlyCycleType).subscribe(regularities => {
      list.length = 0;
      regularities.forEach(regularlyRaw => {
        const regularly: Regularly = regularlyRaw.payload.val() as Regularly;
        regularly.key = regularlyRaw.key ? regularlyRaw.key : '';
        list.push(regularly);
      });
    });
  }

  openAddOrEditRegularlyModal(): void {
    this.addOrEditRegularlyModalRef = this.ngbModal.open(
      this.addOrEditRegularlyModal,
      {
        size: 'md'
      });
  }

  onCloseAddOrEditRegularlyModal(): void {
    if (this.addOrEditRegularlyModalRef) {
      this.addOrEditRegularlyModalRef.close();
    }
  }

  protected readonly RegularlyType = RegularlyType;
}
