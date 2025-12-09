import { Component, EventEmitter, inject, Injector, Input, Output, runInInjectionContext } from '@angular/core';
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
export class AddOrEditCycleContentComponent {
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private helperService = inject(HelperService);
  private dateService = inject(DateService);
  private budgetService = inject(BudgetService);
  private injector = inject(Injector);


  @Input() cycle: (Cycle & { id: string }) | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  title: string = 'Zyklus erstellen';
  submitButtonText: string = 'Erstellen';

  errorCycleCouldNotBeChanged: string = 'Es tut mir leid, der Zyklus konnte nicht editiert werden!';
  errorTypeNotImplemented: string = 'Der ausgewählte Cycle Typ ist nicht implementiert!';
  deleteSuccessMessage: string = '';

  isLimitVisible: boolean = false;
  isCreateNowVisible: boolean = true;
  isNameInvalid: boolean = true;
  isLimitInvalid: boolean = false;

  chosenCycleType: CycleType = CycleType.monthly;

  budgets: (Budget & { id: string })[] = [];

  addCycleFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    initialLimit: new FormControl(''),
    limit: new FormControl(''),
    transfer: new FormControl(''),
    createNow: new FormControl('')
  });

  ngOnInit() {
    this.loadBudgets();
    this.createFormGroup();
    this.setValidators();
    this.fillFormIfCycle();
  }

  createFormGroup() {
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

  setValidators() {
    this.addCycleFormGroup.controls['name'].valueChanges.subscribe((name: string) => {
      this.isNameInvalid = name.length <= 0;
    });
    this.addCycleFormGroup.controls['limit'].valueChanges.subscribe((limit: number) => {
      this.isLimitInvalid = limit <= 0;
    });
    this.addCycleFormGroup.controls['initialLimit'].valueChanges.subscribe(initialLimit => {
      if (!this.isLimitVisible && initialLimit) {
        this.addCycleFormGroup.controls['limit'].setValue(0);
      }
      if (!initialLimit) {
        this.isLimitInvalid = false;
      }
      this.isLimitVisible = initialLimit;
    });
  }

  fillFormIfCycle() {
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

  loadBudgets(): void {
    if (this.cycle) {
      this.budgetService.getAllBudgetsByCycle(this.cycle.id).pipe(
        map(budgets => budgets as (Budget & { id: string })[])
      ).subscribe(budgets => runInInjectionContext(this.injector, () => {
        this.budgets = budgets;
      }));
    }
  }

  onSubmit() {
    let cycle = this.createCycleObjectFromInput();
    this.setInitialLimit(cycle);
    if (this.cycle) {
      // on Change
      this.changeCycle(cycle);
    } else {
      // on Add
      this.addCycle(cycle);
    }
  }

  onDelete() {
    if (this.cycle && this.cycle.key) {
      this.budgetService.deleteCycle(this.cycle.id).then(() => {
        this.toastService.showSuccess(this.deleteSuccessMessage);
        this.onClose.emit();
      });
    }
  }

  createCycleObjectFromInput(): Cycle {
    const name: string = this.addCycleFormGroup.value.name;
    return {
      searchName: this.helperService.createSearchName(name),
      name: name,
      isTransfer: !!this.addCycleFormGroup.value.transfer,
      type: this.chosenCycleType
    };
  }

  setInitialLimit(cycle: Cycle) {
    if (this.addCycleFormGroup.value.initialLimit) {
      cycle.limit = Number(this.addCycleFormGroup.value.limit);
    } else {
      cycle.limit = Number(0);
    }
  }

  changeCycle(cycle: Cycle) {
    if (this.cycle && this.cycle.key) {
      const { id, ...cycleToUpdate } = this.cycle;
      this.budgetService.updateCycle(cycle, id).then(() => {
        this.onClose.emit();
      });
    } else {
      this.toastService.showDanger(this.errorCycleCouldNotBeChanged);
      this.onClose.emit();
    }
  }

  addCycle(cycle: Cycle) {
    this.budgetService.addCycle(cycle).then(cycleReference => {
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
    });
  }

  createBudgetForThisCycle(cycleKey: string) {
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

  onCancel() {
    this.onClose.emit();
  }

  get isInitialLimit() {
    return this.addCycleFormGroup.value.initialLimit;
  }

  protected readonly CycleType = CycleType;

}
