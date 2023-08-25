import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Cycle} from "../../../../entities/cycle.model";
import {CycleType} from "../../../../enums/cycle-type.enum";
import {BudgetService} from "../../../../services/budget/budget.service";
import {ToastService} from "../../../../services/toast/toast.service";
import {Budget} from "../../../../entities/budget.model";
import {HelperService} from "../../../../services/helper/helper.service";
import {DateService} from "../../../../services/date/date.service";

@Component({
  selector: 'app-add-or-edit-cycle-content',
  templateUrl: './add-or-edit-cycle-content.component.html',
  styleUrls: ['./add-or-edit-cycle-content.component.scss']
})
export class AddOrEditCycleContentComponent {

  @Input() cycle: Cycle | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  title: string = 'Zyklus erstellen';
  submitButtonText: string = 'Erstellen';
  errorCycleCouldNotBeChanged: string = 'Es tut mir leid, der Zyklus konnte nicht editiert werden!';
  errorCycleCouldNotBeCreated: string = 'Es tut mir leid, der Zyklus konnte nicht angelegt werden!';
  errorTypeNotImplemented: string = 'Der ausgewählte Cycle Typ ist nicht implementiert!';

  isLimitVisible: boolean = false;
  isCreateNowVisible: boolean = true;
  isNameInvalid: boolean = true;
  isLimitInvalid: boolean = false;

  chosenCycleType: CycleType = CycleType.monthly;

  addCycleFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    initialLimit: new FormControl(''),
    limit: new FormControl(''),
    transfer: new FormControl(''),
    createNow: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private helperService: HelperService,
              private dateService: DateService,
              private budgetService: BudgetService) {
  }

  ngOnInit() {
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
      const key: string = this.cycle.key;
      delete cycle['key'];
      this.budgetService.updateCycle(cycle, key).then(() => {
        this.onClose.emit();
      });
    } else {
      this.toastService.showDanger(this.errorCycleCouldNotBeChanged);
      this.onClose.emit();
    }
  }

  addCycle(cycle: Cycle) {
    this.budgetService.addCycle(cycle).then(() => {
      if (this.addCycleFormGroup.value.createNow) {
        this.createBudgetForThisCycle()?.then(() => {
          this.onClose.emit();
        });
      } else {
        this.toastService.showDanger(this.errorCycleCouldNotBeCreated);
        this.onClose.emit();
      }
    });
  }

  createBudgetForThisCycle() {
    const name: string = this.addCycleFormGroup.value.name;
    switch(this.chosenCycleType) {
      case CycleType.monthly: {
        let budget: Budget = {
          searchName: this.helperService.createSearchName(name),
          name: name,
          validityPeriod: this.dateService.getActualMonthString(),
          isArchived: false
        };
        if (this.addCycleFormGroup.value.initialLimit) {
          budget.limit = Number(this.addCycleFormGroup.value.limit);
        }
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

  protected readonly CycleType = CycleType;
}
