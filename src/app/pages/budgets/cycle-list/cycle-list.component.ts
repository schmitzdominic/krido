import { Component, inject, Injector, runInInjectionContext, ViewChild } from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Cycle} from "../../../../shared/interfaces/cycle.model";
import {BudgetService} from "../../../services/budget/budget.service";
import {PriceService} from "../../../services/price/price.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import {LoadingService} from "../../../services/loading/loading.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-cycle-list',
    templateUrl: './cycle-list.component.html',
    styleUrls: ['./cycle-list.component.scss'],
    standalone: false
})
export class CycleListComponent {
  private ngbModal = inject(NgbModal);
  private budgetService = inject(BudgetService);
  private loadingService = inject(LoadingService);
  private injector = inject(Injector);
  priceService = inject(PriceService);


  @ViewChild('addCycleModal') addCycleModal: NgbModalRef | undefined;

  addCycleModalRef: NgbModalRef | undefined;
  isInitialized: boolean = false;

  cycles: (Cycle & { id: string })[] = [];
  clickedCycle: (Cycle & { id: string }) | undefined;

  ngOnInit() {
    this.loadAllCycles();
  }

  loadAllCycles() {
    this.loadingService.setLoading = true;
    this.budgetService.getAllCycles().pipe(
      map(cycles => cycles as (Cycle & { id: string })[])
    ).subscribe(cycles => runInInjectionContext(this.injector, () => {
      this.cycles = cycles;
      this.loadingService.setLoading = false;
      this.isInitialized = true;
    }));
  }

  onCardClick(cycle: Cycle & { id: string }) {
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
