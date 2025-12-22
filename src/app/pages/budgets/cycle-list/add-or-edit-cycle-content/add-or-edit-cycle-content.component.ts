import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Cycle} from "../../../../../shared/interfaces/cycle.model";
import {CycleType} from "../../../../../shared/enums/cycle-type.enum";
import {BudgetService} from "../../../../services/budget/budget.service";
import {ToastService} from "../../../../services/toast/toast.service";
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {HelperService} from "../../../../services/helper/helper.service";
import {DateService} from "../../../../services/date/date.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-add-or-edit-cycle-content',
    templateUrl: './add-or-edit-cycle-content.component.html',
    styleUrls: ['./add-or-edit-cycle-content.component.scss'],
    standalone: false
})
export class AddOrEditCycleContentComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private helperService = inject(HelperService);
  private dateService = inject(DateService);
  private budgetService = inject(BudgetService);
  private destroyRef = inject(DestroyRef);


  @Input() public cycle: (Cycle & { id: string }) | undefined;

  @Output() public onClose: EventEmitter<any> = new EventEmitter<any>();

  public title: string = 'Zyklus erstellen';
  public submitButtonText: string = 'Erstellen';

  public errorCycleCouldNotBeChanged: string = 'Es tut mir leid, der Zyklus konnte nicht editiert werden!';
  public errorTypeNotImplemented: string = 'Der ausgewählte Cycle Typ ist nicht implementiert!';
  public deleteSuccessMessage: string = '';

  public isLimitVisible: boolean = false;
  public isCreateNowVisible: boolean = true;
  public isNameInvalid: boolean = true;
  public isLimitInvalid: boolean = false;

  public chosenCycleType: CycleType = CycleType.monthly;

  public budgets: (Budget & { id: string })[] = [];

  public addCycleFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    initialLimit: new FormControl(''),
    limit: new FormControl(''),
    transfer: new FormControl(''),
    createNow: new FormControl('')
  });

  /**
   * Initializes the component.
   */
  public ngOnInit() {
    this.loadBudgets();
    this.createFormGroup();
    this.setValidators();
    this.fillFormIfCycle();
  }

  /**
   * Creates the form group.
   */
  private createFormGroup() {
    this.addCycleFormGroup = this.formBuilder.group(
      {
        name: [this.cycle ? this.cycle.name : '', Validators.required],
        initialLimit: [this.cycle && this.cycle.limit ? true : ''],
        limit: [this.cycle && this.cycle.limit ? this.cycle.limit : ''],
        transfer: [this.cycle ? this.cycle.isTransfer : ''],
        createNow: ['']
      }
    );
  }

  /**
   * Sets up validators and subscriptions.
   */
  private setValidators() {
    this.addCycleFormGroup.controls['name'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((name: string) => {
        this.isNameInvalid = name.length <= 0;
      });
    this.addCycleFormGroup.controls['limit'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((limit: number) => {
        this.isLimitInvalid = limit <= 0;
      });
    this.addCycleFormGroup.controls['initialLimit'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(initialLimit => {
      if (!this.isLimitVisible && initialLimit) {
        this.addCycleFormGroup.controls['limit'].setValue(0);
      }
      if (!initialLimit) {
        this.isLimitInvalid = false;
      }
      this.isLimitVisible = initialLimit;
    });
  }

  /**
   * Fills the form if a cycle is present.
   */
  private fillFormIfCycle() {
    if (this.cycle) {
      this.title = 'Zyklus editieren';
      this.submitButtonText = 'Ändern'
      this.isCreateNowVisible = false;
      if (this.cycle.limit) {
        this.isLimitVisible = true;
      }
      this.isNameInvalid = false;
      this.isLimitInvalid = false;

      // Set Generic Error Messages
      this.deleteSuccessMessage = `Cycle ${this.cycle.name} erfolgreich gelöscht`;
    }
  }

  /**
   * Loads the budgets for the cycle.
   */
  private loadBudgets(): void {
    if (this.cycle) {
      this.budgetService.getAllBudgetsByCycle(this.cycle.id).pipe(
        map(budgets => budgets as (Budget & { id: string })[]),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(budgets => {
        this.budgets = budgets;
      });
    }
  }

  /**
   * Handles the submit event.
   */
  public onSubmit() {
    const cycle = this.createCycleObjectFromInput();
    if (this.cycle) {
      // on Change
      this.changeCycle(cycle);
    } else {
      // on Add
      this.addCycle(cycle);
    }
  }

  /**
   * Deletes the current cycle.
   */
  public onDelete() {
    if (this.cycle && this.cycle.id) {
      this.budgetService.deleteCycle(this.cycle.id).then(() => {
        this.toastService.showSuccess(this.deleteSuccessMessage);
        this.onClose.emit();
      });
    }
  }

  /**
   * Creates a cycle object from the input.
   * @returns {Cycle & { id: string }} The cycle object.
   */
  private createCycleObjectFromInput(): Cycle & { id: string } {
    const formValue = this.addCycleFormGroup.getRawValue();
    const name: string = formValue.name;
    const limit = formValue.initialLimit ? Number(formValue.limit) : 0;

    return {
      id: this.cycle?.id ?? '',
      searchName: this.helperService.createSearchName(name),
      name: name,
      isTransfer: !!formValue.transfer,
      type: this.chosenCycleType,
      limit: limit
    };
  }

  /**
   * Updates the cycle.
   * @param {Cycle & { id: string }} cycle The cycle to update.
   */
  private changeCycle(cycle: Cycle & { id: string }) {
    if (this.cycle && this.cycle.id) {
      const { id, ...cycleData } = cycle;
      this.budgetService.updateCycle(cycleData, this.cycle.id).then(() => {
        this.onClose.emit();
      });
    } else {
      this.toastService.showDanger(this.errorCycleCouldNotBeChanged);
      this.onClose.emit();
    }
  }

  /**
   * Adds a new cycle.
   * @param {Cycle & { id: string }} cycle The cycle to add.
   */
  private addCycle(cycle: (Cycle & { id: string })) {
    const { id, ...cycleData } = cycle;
    this.budgetService.addCycle(cycleData as any).then((cycleReference => {
      if (this.addCycleFormGroup.value.createNow) {
        if (cycleReference.key) {
          this.createBudgetForThisCycle(cycleReference.key)?.then(() => {
            this.onClose.emit();
          });
        } else {
          this.toastService.showDanger('Etwas ist schief gelaufen bei der Budget Erstellung');
        }
      } else {
        this.onClose.emit();
      }
    }));
  }

  /**
   * Creates a budget for the cycle.
   * @param {string} cycleKey The key of the cycle.
   * @returns {Promise<any> | null} The promise or null.
   */
  private createBudgetForThisCycle(cycleKey: string) {
    const name: string = this.addCycleFormGroup.value.name;
    switch(this.chosenCycleType) {
      case CycleType.monthly: {
        let budget: Budget = {
          searchName: this.helperService.createSearchName(name),
          name: name,
          validityPeriod: this.dateService.getActualMonthString(),
          isArchived: false,
          limit: this.isInitialLimit ? Number(this.addCycleFormGroup.value.limit) : 0,
          cycleKey: cycleKey
        };
        return this.budgetService.addMonthBudget(budget);
      }
      default: {
        this.toastService.showDanger(this.errorTypeNotImplemented);
        return null;
      }
    }
  }

  public onCancel() {
    this.onClose.emit();
  }

  public get isInitialLimit() {
    return this.addCycleFormGroup.value.initialLimit;
  }

  public readonly CycleType = CycleType;
}
