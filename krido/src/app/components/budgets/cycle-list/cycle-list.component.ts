import {Component, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Cycle} from "../../../entities/cycle.model";
import {BudgetService} from "../../../services/budget/budget.service";
import {PriceService} from "../../../services/price/price.service";

@Component({
  selector: 'app-cycle-list',
  templateUrl: './cycle-list.component.html',
  styleUrls: ['./cycle-list.component.scss']
})
export class CycleListComponent {

  @ViewChild('addCycleModal') addCycleModal: NgbModalRef | undefined;

  addCycleModalRef: NgbModalRef | undefined;

  cycles: Cycle[] = [];
  clickedCycle: Cycle | undefined;

  constructor(private ngbModal: NgbModal,
              private budgetService: BudgetService,
              public priceService: PriceService) {
  }

  ngOnInit() {
    this.loadAllCycles();
  }

  loadAllCycles() {
    this.budgetService.getAllCycles().subscribe(cycles => {
      this.cycles = [];
      cycles.forEach(cycleRaw => {
        const cycle: Cycle = cycleRaw.payload.val() as Cycle;
        cycle.key = cycleRaw.key!;
        this.cycles.push(cycle);
      });
    });
  }

  onCardClick(cycle: Cycle) {
    this.clickedCycle = cycle;
    this.onAddClick();
  }

  onAddClick(): void {
    this.openAddOrEditCycleModal();
  }

  openAddOrEditCycleModal(): void {
    this.addCycleModalRef = this.ngbModal.open(
      this.addCycleModal,
      {
        size: 'sm'
      });
  }

  onCloseAddOrEditCycleModal(): void {
    this.clickedCycle = undefined;
    if (this.addCycleModalRef) {
      this.addCycleModalRef.close();
    }
  }

}
