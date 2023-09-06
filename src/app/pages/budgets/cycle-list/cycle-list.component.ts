import {Component, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Cycle} from "../../../../shared/interfaces/cycle.model";
import {BudgetService} from "../../../services/budget/budget.service";
import {PriceService} from "../../../services/price/price.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import {LoadingService} from "../../../services/loading/loading.service";

@Component({
  selector: 'app-cycle-list',
  templateUrl: './cycle-list.component.html',
  styleUrls: ['./cycle-list.component.scss']
})
export class CycleListComponent {

  @ViewChild('addCycleModal') addCycleModal: NgbModalRef | undefined;

  addCycleModalRef: NgbModalRef | undefined;
  isInitialized: boolean = false;

  cycles: Cycle[] = [];
  clickedCycle: Cycle | undefined;

  constructor(private ngbModal: NgbModal,
              private budgetService: BudgetService,
              private loadingService: LoadingService,
              public priceService: PriceService) {
  }

  ngOnInit() {
    this.loadAllCycles();
  }

  loadAllCycles() {
    this.loadingService.setLoading = true;
    this.budgetService.getAllCycles().subscribe(cycles => {
      this.cycles = [];
      cycles.forEach(cycleRaw => {
        const cycle: Cycle = cycleRaw.payload.val() as Cycle;
        cycle.key = cycleRaw.key!;
        this.cycles.push(cycle);
      });
      this.loadingService.setLoading = false;
      this.isInitialized = true;
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
        size: 'md'
      });
  }

  onCloseAddOrEditCycleModal(): void {
    this.clickedCycle = undefined;
    if (this.addCycleModalRef) {
      this.addCycleModalRef.close();
    }
  }

    protected readonly AccountType = AccountType;
}
