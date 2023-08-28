import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Budget} from "../../../../entities/budget.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BudgetService} from "../../../../services/budget/budget.service";
import {HelperService} from "../../../../services/helper/helper.service";
import {ToastService} from "../../../../services/toast/toast.service";
import {budget} from "@angular/fire/compat/remote-config";

@Component({
  selector: 'app-add-or-edit-budget-content',
  templateUrl: './add-or-edit-budget-content.component.html',
  styleUrls: ['./add-or-edit-budget-content.component.scss']
})
export class AddOrEditBudgetContentComponent {

  @Input() budget: Budget | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  title: string = 'Budget erstellen';
  submitButtonText: string = 'Erstellen';

  archiveSuccessMessage: string = `${budget.name} erfolgreich archiviert`;

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
          name: [this.budget ? this.budget.name : '', Validators.required],
          limit: [this.budget ? this.budget.limit : '', Validators.required]
        }
    );
  }

  setLimitValidator() {
    this.addBudgetFormGroup.controls['limit'].valueChanges.subscribe(limit => {
      if (limit && limit > 0) {
        this.addBudgetFormGroup.controls['limit'].setErrors(null);
      }
    });
  }

  fillFormIfBudget() {
    if (this.budget) {
      this.title = 'Budget editieren';
      this.submitButtonText = 'Ändern'
    }
  }

  onArchive(): void {
    let budget: Budget = this.createBudgetObject();
    budget.isArchived = true;
    if (this.budget?.key) {
      const key: string = this.budget.key;
      delete budget['key'];
      if (this.budget?.validityPeriod) {
        this.budgetService.updateMonthBudget(budget, key).then(() => {
          this.toastService.showSuccess(this.archiveSuccessMessage);
          this.onClose.emit();
        });
      } else {
        this.budgetService.updateNoTimeLimitBudget(budget, key). then(() => {
          this.toastService.showSuccess(this.archiveSuccessMessage);
          this.onClose.emit();
        });
      }
    }
  }

  onCancel() {
    this.onClose.emit();
  }

  onSubmit() {
    this.persistBudgetAndCloseModal();
  }

  createBudgetObject(): Budget {
    return {
      searchName: this.helperService.createSearchName(this.addBudgetFormGroup.value.name),
      name: this.addBudgetFormGroup.value.name,
      limit: this.addBudgetFormGroup.value.limit,
      isArchived: false
    };
  }

  persistBudgetAndCloseModal() {
    const budget = this.createBudgetObject();
    if (this.budget) {
      // Edit existing budget
      if (this.budget.key) {
        const key = this.budget.key;
        delete budget['key'];
        if (this.budget.validityPeriod) {
          this.budgetService.updateMonthBudget(budget, key).then(() => {
            this.onClose.emit();
          });
        } else {
          this.budgetService.updateNoTimeLimitBudget(budget, key).then(() => {
            this.onClose.emit();
          });
        }
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
