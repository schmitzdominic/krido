import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BudgetService} from "../../../../services/budget/budget.service";
import {HelperService} from "../../../../services/helper/helper.service";
import {ToastService} from "../../../../services/toast/toast.service";

@Component({
    selector: 'app-add-or-edit-budget-content',
    templateUrl: './add-or-edit-budget-content.component.html',
    styleUrls: ['./add-or-edit-budget-content.component.scss'],
    standalone: false
})
export class AddOrEditBudgetContentComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private budgetService = inject(BudgetService);
  private helperService = inject(HelperService);
  private toastService = inject(ToastService);


  @Input() public budget: Budget & { id: string } | undefined;

  @Output() public onClose: EventEmitter<any> = new EventEmitter<any>();

  public title: string = 'Budget erstellen';
  public submitButtonText: string = 'Erstellen';

  public archiveSuccessArchivedMessage: string = '';
  public archiveSuccessDeArchivedMessage: string = '';
  public deleteSuccessMessage: string = '';
  public errorMessageDeleteNotPossible: string = 'Es tut mir leid, dein Budget enthält noch Einträge';


  public isDeleteAvailable: boolean = false;

  public addBudgetFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    limit: new FormControl('')
  });

  /**
   * Initializes the component.
   */
  public ngOnInit() {
    this.createFormGroup();
    this.fillFormIfBudget();
  }

  /**
   * Creates the form group with validators.
   */
  private createFormGroup() {
    this.addBudgetFormGroup = this.formBuilder.group(
        {
          name: [this.budget ? this.budget.name : '', Validators.required],
          limit: [this.budget ? this.budget.limit : '', [Validators.required, Validators.min(0.01)]]
        }
    );
  }

  /**
   * Fills the form and sets UI state if editing an existing budget.
   */
  private fillFormIfBudget() {
    if (this.budget) {
      this.title = 'Budget editieren';
      this.submitButtonText = 'Ändern';
      this.isDeleteAvailable = this.isDeleteButtonAvailable();

      // Set Generic Error Messages
      this.archiveSuccessArchivedMessage = `Budget ${this.budget.name} erfolgreich archiviert`;
      this.archiveSuccessDeArchivedMessage = `Budget ${this.budget.name} erfolgreich aktiviert`;
      this.deleteSuccessMessage = `Budget ${this.budget.name} erfolgreich gelöscht`;
    }
  }

  /**
   * Archives the current budget.
   */
  public onArchive(): void {
    this.setArchiveState(true);
  }

  /**
   * De-archives the current budget.
   */
  public onDeArchive(): void {
    this.setArchiveState(false);
  }

  /**
   * Deletes the current budget if it has no entries.
   */
  public async onDelete(): Promise<void> {
    if (!this.budget?.id) return;

    if (!this.budget.entries || this.budget.entries.length === 0) {
      const deletePromise = this.isMonthlyBudget()
        ? this.budgetService.deleteMonthBudget(this.budget.id)
        : this.budgetService.deleteBudget(this.budget.id);
      await this.executeServiceAction(deletePromise, this.deleteSuccessMessage);
    } else {
      this.toastService.showDanger(this.errorMessageDeleteNotPossible);
    }
  }

  /**
   * Closes the modal.
   */
  public onCancel() {
    this.onClose.emit();
  }

  /**
   * Handles form submission.
   */
  public async onSubmit() {
    await this.persistBudgetAndCloseModal();
  }

  /**
   * Creates a Budget object from form values.
   * @returns {Budget} The created budget object.
   */
  private createBudgetObject(): Budget {
    const formValue = this.addBudgetFormGroup.getRawValue();
    return {
      searchName: this.helperService.createSearchName(formValue.name),
      name: formValue.name,
      limit: formValue.limit,
      isArchived: false
    };
  }

  /**
   * Saves the budget (create or update) and closes the modal.
   */
  private async persistBudgetAndCloseModal() {
    const budget = this.createBudgetObject();

    if (this.budget?.id) {
      // Edit
      const updatePromise = this.isMonthlyBudget()
        ? this.budgetService.updateMonthBudget(budget, this.budget.id)
        : this.budgetService.updateNoTimeLimitBudget(budget, this.budget.id);
      await this.executeServiceAction(updatePromise);
    } else {
      // Create
      await this.executeServiceAction(Promise.resolve(this.budgetService.addBudget(budget)));
    }
  }

  /**
   * Sets the archive state of the budget.
   * @param {boolean} state True to archive, false to de-archive.
   */
  private async setArchiveState(state: boolean) {
    if (!this.budget?.id) return;

    const budget: Budget = this.createBudgetObject();
    budget.isArchived = state;

    const archivePromise = this.isMonthlyBudget()
      ? this.budgetService.updateMonthBudget(budget, this.budget.id)
      : this.budgetService.updateNoTimeLimitBudget(budget, this.budget.id);

    const message = state ? this.archiveSuccessArchivedMessage : this.archiveSuccessDeArchivedMessage;
    await this.executeServiceAction(archivePromise, message);
  }

  /**
   * Executes a service promise and handles success/error toasts.
   * @param {Promise<any>} promise The promise to execute.
   * @param {string} [successMessage] Optional success message.
   */
  private async executeServiceAction(promise: Promise<any>, successMessage?: string): Promise<void> {
    try {
      await promise;
      if (successMessage) {
        this.toastService.showSuccess(successMessage);
      }
      this.onClose.emit();
    } catch (error) {
      this.toastService.showDanger('Es tut mir leid, die Aktion konnte nicht ausgeführt werden.');
    }
  }

  /**
   * Checks if the delete button should be available.
   * @returns {boolean} True if delete is possible.
   */
  private isDeleteButtonAvailable() {
    return !!(this.budget?.isArchived && (!this.budget.entries || this.budget.entries.length === 0));
  }

  /**
   * Checks if the current budget is a monthly budget.
   * @returns {boolean} True if monthly.
   */
  private isMonthlyBudget(): boolean {
    return !!this.budget?.validityPeriod;
  }
}
