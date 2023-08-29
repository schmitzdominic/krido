import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Budget} from "../../../../entities/budget.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BudgetService} from "../../../../services/budget/budget.service";
import {HelperService} from "../../../../services/helper/helper.service";
import {ToastService} from "../../../../services/toast/toast.service";

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

  archiveSuccessArchivedMessage: string = '';
  archiveSuccessDeArchivedMessage: string = '';
  deleteSuccessMessage: string = '';
  errorMessageDeleteNotPossible: string = 'Es tut mir leid, dein Budget enthält noch Einträge';


  isDeleteAvailable: boolean = false;

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
    this.isDeleteAvailable = this.isDeleteButtonAvailable();
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
      this.submitButtonText = 'Ändern';

      // Set Generic Error Messages
      this.archiveSuccessArchivedMessage = `${this.budget.name} erfolgreich archiviert`;
      this.archiveSuccessDeArchivedMessage = `${this.budget.name} erfolgreich aktiviert`;
      this.deleteSuccessMessage = `${this.budget.name} erfolgreich gelöscht`;
    }
  }

  onArchive(): void {
    this.setArchiveState(true);
  }

  onDeArchive(): void {
    this.setArchiveState(false);
  }

  onDelete(): void {
    if (!this.budget?.entries) {
      if (this.budget && this.budget.key && this.budget?.validityPeriod) {
        this.budgetService.deleteMonthBudget(this.budget.key).then(() => {
          this.toastService.showSuccess(this.deleteSuccessMessage);
          this.onClose.emit();
        });
      }
      if (this.budget && this.budget.key && !this.budget.validityPeriod) {
        this.budgetService.deleteBudget(this.budget.key).then(() => {
          this.toastService.showSuccess(this.deleteSuccessMessage);
          this.onClose.emit();
        });
      }
    } else {
      this.toastService.showDanger(this.errorMessageDeleteNotPossible);
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
        const key: string = this.budget.key;
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

  setArchiveState(state: boolean) {
    let budget: Budget = this.createBudgetObject();
    budget.isArchived = state;
    if (this.budget?.key) {
      const key: string = this.budget.key;
      delete budget['key'];
      if (this.budget?.validityPeriod) {
        this.budgetService.updateMonthBudget(budget, key).then(() => {
          this.toastService.showSuccess(state ? this.archiveSuccessArchivedMessage : this.archiveSuccessDeArchivedMessage);
          this.onClose.emit();
        });
      } else {
        this.budgetService.updateNoTimeLimitBudget(budget, key). then(() => {
          this.toastService.showSuccess(state ? this.archiveSuccessArchivedMessage : this.archiveSuccessDeArchivedMessage);
          this.onClose.emit();
        });
      }
    }
  }

  isDeleteButtonAvailable() {
    return this.budget && this.budget.isArchived && !this.budget.entries || this.budget?.entries?.length == 0;
  }
}
