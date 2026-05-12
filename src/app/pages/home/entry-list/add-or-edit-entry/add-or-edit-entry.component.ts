import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {UserService} from '../../../../services/user/user.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EntryType} from "../../../../../shared/enums/entry-type.enum";
import {AccountType} from "../../../../../shared/enums/account-type.enum";
import {AccountService} from "../../../../services/account/account.service";
import {Account} from "../../../../../shared/interfaces/account.model";
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {BudgetService} from "../../../../services/budget/budget.service";
import {DateService} from "../../../../services/date/date.service";
import {NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Entry} from "../../../../../shared/interfaces/entry.model";
import {HelperService} from "../../../../services/helper/helper.service";
import {EntryService} from "../../../../services/entry/entry.service";
import {forkJoin, map, Subject, take, takeUntil} from "rxjs";

interface EntryTypeInterface {
  value: EntryType,
  label: string,
}
@Component({
    selector: 'app-add-or-edit-entry',
    templateUrl: './add-or-edit-entry.component.html',
    styleUrls: ['./add-or-edit-entry.component.scss'],
    standalone: false
})
export class AddOrEditEntryComponent {
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private budgetService = inject(BudgetService);
  private dateService = inject(DateService);
  private helperService = inject(HelperService);
  private ngbCalendar = inject(NgbCalendar);
  private entryService = inject(EntryService);
  private userService = inject(UserService);

  private destroy$ = new Subject<void>();


  @Input() entry: (Entry & { id: string; budget?: Budget }) | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  expenditureEntryType: EntryTypeInterface = {value: EntryType.outcome, label: 'Ausgabe'};
  incomeEntryType: EntryTypeInterface = {value: EntryType.income, label: 'Einnahme'}
  selectedEntryType: EntryTypeInterface = this.expenditureEntryType;
  entryTypes: EntryTypeInterface[] = [this.expenditureEntryType, this.incomeEntryType];
  accounts: (Account & { id: string })[] = [];
  budgets: (Budget & { id: string })[] = [];
  noBudgetKey: string = 'noBudget';
  selectedDate: NgbDate = this.ngbCalendar.getToday();
  selectedDateTimestamp: number = this.dateService.getTimestampFromNgbDate(this.selectedDate);

  isNameInvalid: boolean = true;
  isValueInvalid: boolean = true;
  isEdited: boolean = false;

  addOrEditEntryFormGroup: FormGroup = new FormGroup({
    entryType: new FormControl(''),
    name: new FormControl('', Validators.required),
    value: new FormControl(''),
    account: new FormControl(''),
    budget: new FormControl(''),
    date: new FormControl(''),
  });

  noBudgetValue: Budget = {
    name: 'Kein Budget gewählt',
    searchName: 'noBudget',
    isArchived: false
  }

  title: string = this.selectedEntryType.label;
  submitButtonText: string = 'Eintragen';

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  public ngOnInit(): void {
    this.createFormGroup();
    this.createListeners();
    this.loadAccounts();
    this.loadBudgets();
    this.fillFormIfEntryIsAvailable();
    if (!this.entry?.id) {
      this.isEdited = true;
    }
  }

  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initializes the reactive form group for adding or editing an entry.
   * It sets up the form controls and their initial values,
   * either from an existing entry or with defaults for a new entry.
   */
  private createFormGroup(): void {
    this.addOrEditEntryFormGroup = this.formBuilder.group(
      {
        entryType: [this.entry ? this.entry.type : this.selectedEntryType.value],
        name: [this.entry ? this.entry.name : '', Validators.required],
        value: [this.entry ? this.entry.value : ''],
        account: [this.entry ? ((this.entry.account as any)?.id ?? (this.entry.account as any)?.key ?? '') : ''],
        budget: [this.entry ? (this.entry.budgetKey ?? (this.entry.budget as any)?.id ?? (this.entry.budget as any)?.key ?? '') : ''],
        date: [this.entry ? this.entry.date : this.selectedDate]
      }
    );
  }

  /**
   * If an entry is being edited, this method pre-fills the form
   * with the existing entry's data.
   */
  private fillFormIfEntryIsAvailable(): void {
    if (this.entry?.id) {
      this.isNameInvalid = false;
      this.isValueInvalid = false;
      this.selectedEntryType = this.entry.type === EntryType.income ? this.incomeEntryType : this.expenditureEntryType;
      this.title = this.entry.type === EntryType.income ? this.incomeEntryType.label : this.expenditureEntryType.label;
      const date: Date = this.dateService.getDateFromTimestamp(this.entry.date);
      this.selectedDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
      this.selectedDateTimestamp = this.entry.date;
      this.submitButtonText = 'Ändern'
    }
  }

  /**
   * Sets up listeners for form control value changes to react dynamically
   * to user input, e.g., updating the title based on the selected entry type.
   */
  private createListeners(): void {
    this.addOrEditEntryFormGroup.controls['entryType'].valueChanges.subscribe(entryTypeName => {
      switch (entryTypeName) {
        case this.expenditureEntryType.value: {
          this.selectedEntryType = this.expenditureEntryType;
          break;
        }
        case this.incomeEntryType.value: {
          this.selectedEntryType = this.incomeEntryType;
          break;
        }
      }
      this.title = this.selectedEntryType.label;
    });
    this.addOrEditEntryFormGroup.controls['name'].valueChanges.subscribe((name: string) => {
      this.isNameInvalid = name.length <= 0;
      this.isEdited = true;
    });
    this.addOrEditEntryFormGroup.controls['value'].valueChanges.subscribe(value => {
      this.isValueInvalid = value < 0 || value === null || value === undefined;
      this.isEdited = true;
    });
    this.addOrEditEntryFormGroup.controls['account'].valueChanges.subscribe(() => {
      this.isEdited = true;
    });
    this.addOrEditEntryFormGroup.controls['budget'].valueChanges.subscribe(() => {
      this.isEdited = true;
    });
  }

  /**
   * Fetches all available accounts from the AccountService and populates the accounts list.
   */
  private loadAccounts(): void {
    this.accountService.getAllAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          this.accounts = accounts as (Account & { id: string })[];
          if (this.entry) {
            // Editing: resolve account by id OR key (old entries may use key)
            const entryAccId = (this.entry.account as any)?.id ?? (this.entry.account as any)?.key;
            const matched = this.accounts.find(a => a.id === entryAccId);
            if (matched) {
              this.addOrEditEntryFormGroup.controls['account'].setValue(matched.id, { emitEvent: false });
            }
          } else if (this.accounts.length > 0) {
            // New entry: prefer main account, fallback to first account
            const mainId = (this.userService.mainAccount as any)?.id ?? (this.userService.mainAccount as any)?.key;
            const mainAccount = mainId ? this.accounts.find(a => a.id === mainId) : null;
            const defaultAcc = mainAccount ?? this.accounts[0];
            this.addOrEditEntryFormGroup.controls['account'].setValue(defaultAcc.id, { emitEvent: false });
          }
        },
        error: (err) => console.error('Fehler beim Laden der Konten', err)
      });
  }

  /**
   * Fetches all relevant budgets (monthly and all-time) from the BudgetService.
   */
  private loadBudgets(): void {
    const monthString = this.dateService.getActualMonthString();
    const monthlyBudgets$ = this.budgetService.getAllMonthBudgetsByMonthString(monthString).pipe(take(1), map(b => b as (Budget & { id: string })[]));
    const allTimeBudgets$ = this.budgetService.getAllNoTimeLimitBudgets().pipe(take(1), map(b => b as (Budget & { id: string })[]));

    forkJoin([monthlyBudgets$, allTimeBudgets$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([monthlyBudgets, allTimeBudgets]) => {
          const activeBudgets = [...monthlyBudgets, ...allTimeBudgets]
            .filter(budget => !budget.isArchived)
            .map(budget => ({ ...budget, key: budget.key ?? budget.id }));
          this.budgets = [
            { ...this.noBudgetValue, id: this.noBudgetKey, key: this.noBudgetKey },
            ...activeBudgets
          ];
    
          // Resolve the budget id from either budgetKey (new entries) or budget.id/key (old entries)
          const entryBudgetId = this.entry
            ? (this.entry.budgetKey ?? (this.entry.budget as any)?.id ?? (this.entry.budget as any)?.key ?? null)
            : null;
          if (entryBudgetId) {
            const matched = this.budgets.find(b => b.id === entryBudgetId || b.key === entryBudgetId);
            this.addOrEditEntryFormGroup.controls['budget'].setValue(
              matched ? (matched.key ?? matched.id) : this.noBudgetKey,
              { emitEvent: false }
            );
          } else {
            this.addOrEditEntryFormGroup.controls['budget'].setValue(this.noBudgetKey, { emitEvent: false });
          }
        },
        error: (err) => console.error('Fehler beim Laden der Budgets', err)
      });
  }

  /**
   * Sets the value of the 'entryType' form control.
   * @param entryType The selected entry type object.
   */
  public selectEntryType(entryType: EntryTypeInterface): void {
    this.addOrEditEntryFormGroup.controls['entryType'].setValue(entryType.value);
    this.isEdited = true;
  }

  /**
   * Sets the value of the 'account' form control.
   * @param account The selected account object.
   */
  public selectAccount(account: Account & { id: string }): void {
    this.addOrEditEntryFormGroup.controls['account'].setValue(account.id);
    this.isEdited = true;
  }

  /**
   * Sets the value of the 'budget' form control.
   * @param budget The selected budget object.
   */
  public selectBudget(budget: Budget & { id: string }): void {
    this.addOrEditEntryFormGroup.controls['budget'].setValue(budget.key ?? budget.id);
    this.isEdited = true;
  }

  /**
   * Handles the date selection event from the date picker.
   * @param ngbDate The selected date from the NgbDatepicker.
   */
  public onDateSelected(ngbDate: NgbDate): void {
    this.selectedDateTimestamp = this.dateService.getTimestampFromNgbDate(ngbDate);
    this.isEdited = true;
  }

  /**
   * Handles the delete button click. Deletes the current entry and closes the modal.
   */
  public onButtonDelete(): void {
    const account = this.entry!.account;
    this.entryService.deleteEntry(this.entry!.id).then(() => {
      if (account.accountType === AccountType.creditCard) {
        const delta = -this.getCCDelta(this.entry!.value, this.entry!.type);
        this.updateCreditCardInvoiceEntry(account, this.entry!.monthString, this.entry!.date, delta);
      }
      this.closeModal();
    }).catch(err => console.error("Error deleting entry:", err));
  }

  /**
   * Handles the form submission.
   * It determines whether to call the add or edit handler based on whether an entry is being edited.
   */
  public onSubmit(): void {
    if (this.entry) {
      this.onEdit();
    } else {
      this.onAdd();
    }
  }

  /**
   * Handles the logic for updating an existing entry.
   */
  private onEdit(): void {
    const entryData = this.getEntryObject();

    // If "no budget" was chosen, delete the budget fields from the RTDB entry
    if (!this.selectedBudget && this.entry?.budget) {
      (entryData as any).budgetKey = null;
      (entryData as any).budget = null;
    }

    const oldAccount = this.entry!.account;
    const newAccount = this.selectedAccount;

    this.entryService.updateEntry(entryData, this.entry!.id).then(() => {
      // Reverse old CC contribution
      if (oldAccount.accountType === AccountType.creditCard) {
        const reverseDelta = -this.getCCDelta(this.entry!.value, this.entry!.type);
        this.updateCreditCardInvoiceEntry(oldAccount, this.entry!.monthString, this.entry!.date, reverseDelta);
      }
      // Apply new CC contribution
      if (newAccount.accountType === AccountType.creditCard) {
        const forwardDelta = this.getCCDelta(entryData.value, entryData.type);
        this.updateCreditCardInvoiceEntry(newAccount, entryData.monthString, entryData.date, forwardDelta);
      }
      this.closeModal();
    }).catch(err => console.error("Error updating entry:", err));
  }

  /**
   * Handles the logic for adding a new entry.
   */
  private onAdd(): void {
    const entryObject = this.getEntryObject();
    const account = this.selectedAccount;
    this.entryService.addEntry(entryObject).then(() => {
      if (account.accountType === AccountType.creditCard) {
        const delta = this.getCCDelta(entryObject.value, entryObject.type);
        this.updateCreditCardInvoiceEntry(account, entryObject.monthString, entryObject.date, delta);
      }
      this.closeModal();
    }).catch(err => console.error("Error adding entry:", err));
  }

  /**
   * Constructs and returns the entry object from the form group values.
   * @returns The entry object, ready to be saved to the database.
   */
  private getEntryObject(): Entry & { budget?: Budget } {
    const name: string = this.addOrEditEntryFormGroup.value.name;
    const value: number = this.addOrEditEntryFormGroup.value.value;
    const entry: Entry & { budget?: Budget } = {
      type: this.selectedEntryType.value,
      name: name,
      searchName: this.helperService.createSearchName(name),
      value: value,
      date: this.selectedDateTimestamp,
      account: this.selectedAccount,
      monthString: this.dateService.getMonthStringFromDate(new Date(this.selectedDateTimestamp))
    };

    if (this.selectedBudget) {
      entry.budgetKey = this.selectedBudget.id;  // id is always the reliable Firebase key
      entry.budget = this.selectedBudget;
    }
    return entry;
  }

  /**
   * Handles the cancel button click. Emits the onClose event to close the modal.
   */
  public onButtonCancel(): void {
    this.closeModal();
  }

  private closeModal(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.onClose.emit();
  }

  /** Returns the timestamp of the CC statement day (billingDay) for a given month.
   *  Used to determine whether an entry falls before or after the statement cutoff.
   */
  private getCCStatementTimestamp(account: Account, monthString: string): number {
    const year = this.dateService.getYear(monthString);
    const monthIndex = this.dateService.getMonthIndex(monthString);
    const day = account.billingLastDay
      ? this.dateService.getLastDayOfMonth(new Date(year, monthIndex))
      : (account.billingDay ?? 1);
    return new Date(year, monthIndex, day).getTime();
  }

  /** Returns the expected debit timestamp (creditDay) of the CC invoice entry for a given month.
   *  Used by pickEntry to identify the correct invoice entry among duplicates.
   */
  private getCCDebitTimestamp(account: Account, monthString: string): number {
    const year = this.dateService.getYear(monthString);
    const monthIndex = this.dateService.getMonthIndex(monthString);
    const day = account.creditLastDay
      ? this.dateService.getLastDayOfMonth(new Date(year, monthIndex))
      : (account.creditDay ?? 1);
    return this.dateService.getAvailableWeekdayAsTimestampFromTimestamp(new Date(year, monthIndex, day).getTime());
  }

  /** Returns the billing month string (next month) for a given transaction month string.
   *  CC invoice entries are always created for the following month by PredictService.
   */
  private getBillingMonthString(transactionMonthString: string): string {
    const year = this.dateService.getYear(transactionMonthString);
    const monthIndex = this.dateService.getMonthIndex(transactionMonthString);
    const date = new Date(year, monthIndex + 1, 1);
    return this.dateService.getMonthStringFromDate(date);
  }

  /** Returns the signed delta that a given entry contributes to the CC invoice total. */
  private getCCDelta(value: number, type: EntryType): number {
    return type === EntryType.outcome ? value : -value;
  }

  /** Finds the correct CC invoice entry and adjusts its value by valueDelta.
   *  - If entryDate > statement day of transactionMonth → update next month's CC invoice entry.
   *  - If entryDate <= statement day → update same month's CC invoice entry.
   *  - If no matching entry exists in the target month → skip silently (no fallback).
   *  - If multiple entries exist in the target month, the one matching creditDay is preferred.
   */
  private updateCreditCardInvoiceEntry(account: Account, transactionMonthString: string, entryDate: number, valueDelta: number): void {
    if (!valueDelta) return;

    const statementTs = this.getCCStatementTimestamp(account, transactionMonthString);
    const targetMonthString = entryDate > statementTs
      ? this.getBillingMonthString(transactionMonthString)
      : transactionMonthString;

    const pickEntry = (entries: (Entry & { id: string })[]): (Entry & { id: string }) | undefined => {
      if (entries.length === 0) return undefined;
      if (entries.length === 1) return entries[0];
      const expectedTs = this.getCCDebitTimestamp(account, targetMonthString);
      return entries.find(e => e.date === expectedTs) ?? entries[0];
    };

    this.entryService.getCreditCardInvoiceEntries(account.searchName, targetMonthString)
      .pipe(take(1))
      .subscribe(entries => {
        const invoiceEntry = pickEntry(entries);
        if (invoiceEntry) {
          const currentSigned = invoiceEntry.type === EntryType.outcome
            ? invoiceEntry.value
            : -invoiceEntry.value;
          const newSigned = currentSigned + valueDelta;
          const newType = newSigned >= 0 ? EntryType.outcome : EntryType.income;
          const newValue = Math.abs(newSigned);
          this.entryService.updateEntry({ value: newValue, type: newType }, invoiceEntry.id!);
        }
      });
  }

  /**
   * Getter for the currently selected account object.
   */
  public get selectedAccount(): Account {
    const account = this.accounts.find(acc => acc.id === this.addOrEditEntryFormGroup.value.account);
    return account ? account : this.accountService.noAccountValue;
  }

  /**
   * Getter for the currently selected budget object.
   */
  public get selectedBudget(): (Budget & { id: string }) | undefined {
    const budget = this.budgets.find(b => (b.key ?? b.id) === this.addOrEditEntryFormGroup.value.budget);
    if (!budget || budget.key === this.noBudgetKey) {
      return undefined;
    }
    return budget;
  }
}
