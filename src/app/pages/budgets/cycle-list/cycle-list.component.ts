import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class CycleListComponent implements OnInit {
  private ngbModal = inject(NgbModal);
  private budgetService = inject(BudgetService);
  private loadingService = inject(LoadingService);
  private destroyRef = inject(DestroyRef);
  public priceService = inject(PriceService);


  @ViewChild('addCycleModal') public addCycleModal: NgbModalRef | undefined;

  public addCycleModalRef: NgbModalRef | undefined;
  public isInitialized: boolean = false;

  public cycles: (Cycle & { id: string })[] = [];
  public clickedCycle: (Cycle & { id: string }) | undefined;

  /**
   * Initializes the component.
   */
  public ngOnInit() {
    this.loadAllCycles();
  }

  /**
   * Loads all cycles from the service.
   */
  private loadAllCycles() {
    this.loadingService.setLoading = true;
    this.budgetService.getAllCycles().pipe(
      map(cycles => cycles as (Cycle & { id: string })[]),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(cycles => {
      this.cycles = cycles;
      this.loadingService.setLoading = false;
      this.isInitialized = true;
    });
  }

  /**
   * Handles the click on a cycle card to edit it.
   * @param {Cycle & { id: string }} cycle The cycle to edit.
   */
  public onCardClick(cycle: Cycle & { id: string }) {
    this.clickedCycle = cycle;
    this.onAddClick();
  }

  /**
   * Opens the modal to add or edit a cycle.
   */
  public onAddClick(): void {
    this.openAddOrEditCycleModal();
  }

  /**
   * Opens the modal instance.
   */
  public openAddOrEditCycleModal(): void {
    this.addCycleModalRef = this.ngbModal.open(
      this.addCycleModal,
      {
        size: 'md'
      });
  }

  /**
   * Closes the modal and resets the selected cycle.
   */
  public onCloseAddOrEditCycleModal(): void {
    this.clickedCycle = undefined;
    if (this.addCycleModalRef) {
      this.addCycleModalRef.close();
    }
  }

  public readonly AccountType = AccountType;
}
