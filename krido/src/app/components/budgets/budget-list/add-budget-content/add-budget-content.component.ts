import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Budget} from "../../../../entities/budget.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BudgetService} from "../../../../services/budget/budget.service";
import {HelperService} from "../../../../services/helper/helper.service";
import {ToastService} from "../../../../services/toast/toast.service";

@Component({
  selector: 'app-add-budget-content',
  templateUrl: './add-budget-content.component.html',
  styleUrls: ['./add-budget-content.component.scss']
})
export class AddBudgetContentComponent {

  @Input() budget: Budget | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  title: string = 'Budget erstellen';
  submitButtonText: string = 'Erstellen';

  addBudgetFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    limit: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder,
              private budgetService: BudgetService,
              private helperService: HelperService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.setLimitValidator();
    this.fillFormIfBudget();
  }

  createFormGroup() {
    this.addBudgetFormGroup = this.formBuilder.group(
        {
          name: ['', Validators.required],
          limit: ['', Validators.required]
        }
    );
  }

  setLimitValidator() {
    this.addBudgetFormGroup.controls['limit'].valueChanges.subscribe(limit => {
      if (limit) {
        this.addBudgetFormGroup.controls['limit'].setErrors(null);
      }
    });
  }

  fillFormIfBudget() {
    if (this.budget) {
      this.title = 'Budget editieren';
      this.submitButtonText = 'Ändern'
      this.addBudgetFormGroup.controls['name'].setValue(this.budget.name);
      this.addBudgetFormGroup.controls['limit'].setValue(this.budget.limit);
    }
  }

  onCancel() {
    this.onClose.emit();
  }

  onSubmit() {
    this.persistBudgetAndCloseModal();
  }

  persistBudgetAndCloseModal() {
    const budget: Budget = {
      searchName: this.helperService.createSearchName(this.addBudgetFormGroup.value.name),
      name: this.addBudgetFormGroup.value.name,
      limit: this.addBudgetFormGroup.value.limit
    };
    if (this.budget) {
      // Edit existing budget
      if (this.budget.key) {
        const key = this.budget.key;
        delete budget['key'];
        this.budgetService.updateBudget(budget, key).then(() => {
          this.onClose.emit();
        });
      } else {
        this.toastService.showDanger('Es tut mir leid, dein Budget konnte nicht editiert werden!');
        this.onClose.emit();
      }
    } else {
     // Create new budget
      this.budgetService.addBudget(budget).then(() => {
        this.onClose.emit();
      });
    }
  }

}
