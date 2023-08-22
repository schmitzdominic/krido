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
  selector: 'app-add-cycle-content',
  templateUrl: './add-cycle-content.component.html',
  styleUrls: ['./add-cycle-content.component.scss']
})
export class AddCycleContentComponent {

  @Input() cycle: Cycle | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  title: string = 'Zyklus erstellen';
  submitButtonText: string = 'Erstellen';

  isLimitVisible: boolean = false;
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
  }

  createFormGroup() {
    this.addCycleFormGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        initialLimit: [''],
        limit: [''],
        transfer: [''],
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


  onSubmit() {
    const name: string = this.addCycleFormGroup.value.name;
    let cycle: Cycle = {
      searchName: this.helperService.createSearchName(name),
      name: name,
      isTransfer: !!this.addCycleFormGroup.value.transfer,
      type: this.chosenCycleType
    }
    if (this.addCycleFormGroup.value.initialLimit) {
      cycle.limit = Number(this.addCycleFormGroup.value.limit);
    }
    this.budgetService.addCycle(cycle).then(() => {
      if (this.addCycleFormGroup.value.createNow) {
        this.createBudgetForThisCycle()?.then(() => {
          this.onClose.emit();
        });
      } else {
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
        this.toastService.showDanger('Der ausgewählte Cycle Typ ist nicht implementiert!');
        return null;
      }
    }
  }

  onCancel() {
    this.onClose.emit();
  }

  protected readonly CycleType = CycleType;
}
