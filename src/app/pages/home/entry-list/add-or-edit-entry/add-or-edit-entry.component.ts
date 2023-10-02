import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EntryType} from "../../../../../shared/enums/entry-type.enum";
import {AccountService} from "../../../../services/account/account.service";
import {Account} from "../../../../../shared/interfaces/account.model";
import {UserService} from "../../../../services/user/user.service";
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {BudgetService} from "../../../../services/budget/budget.service";
import {SnapshotAction} from "@angular/fire/compat/database";
import {DateService} from "../../../../services/date/date.service";
import {NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Entry} from "../../../../../shared/interfaces/entry.model";
import {HelperService} from "../../../../services/helper/helper.service";
import {EntryService} from "../../../../services/entry/entry.service";

interface EntryTypeInterface {
  value: EntryType,
  label: string,
}
@Component({
  selector: 'app-add-or-edit-entry',
  templateUrl: './add-or-edit-entry.component.html',
  styleUrls: ['./add-or-edit-entry.component.scss']
})
export class AddOrEditEntryComponent {

  @Input() entry: Entry | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  expenditureEntryType: EntryTypeInterface = {value: EntryType.outcome, label: 'Ausgabe'};
  incomeEntryType: EntryTypeInterface = {value: EntryType.income, label: 'Einnahme'}
  selectedEntryType: EntryTypeInterface = this.expenditureEntryType;
  entryTypes: EntryTypeInterface[] = [this.expenditureEntryType, this.incomeEntryType]
  accounts: Account[] = [];
  budgets: Budget[] = [];
  noBudgetKey: string = 'noBudget';
  selectedDate: NgbDate = this.ngbCalendar.getToday();
  selectedDateTimestamp: number = this.dateService.getTimestampFromNgbDate(this.selectedDate);

  isNameInvalid: boolean = true;
  isValueInvalid: boolean = true;

  addOrEditEntryFormGroup: FormGroup = new FormGroup({
    entryType: new FormControl(''),
    name: new FormControl('', Validators.required),
    value: new FormControl(''),
    date: new FormControl(''),
    account: new FormControl(''),
    budget: new FormControl(''),
  });

  noBudgetValue: Budget = {
    key: this.noBudgetKey,
    name: 'Kein Budget gewählt',
    searchName: 'noBudget',
    isArchived: false
  }

  title: string = this.selectedEntryType.label;
  submitButtonText: string = 'Eintragen';

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private userService: UserService,
              private budgetService: BudgetService,
              private dateService: DateService,
              private helperService: HelperService,
              private ngbCalendar: NgbCalendar,
              private entryService: EntryService) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.createListeners();
    this.loadAccounts();
    this.loadBudgets();
    this.fillFormIfEntryIsAvailable();
  }

  private createFormGroup() {
    this.addOrEditEntryFormGroup = this.formBuilder.group(
      {
        entryType: [this.entry ? this.entry.type : this.selectedEntryType.value],
        name: [this.entry ? this.entry.name : '', Validators.required],
        value: [this.entry ? this.entry.value : ''],
        date: [this.entry ? this.entry.date : this.selectedDate],
        account: [this.entry ? this.entry.account.key : ''],
        budget: [this.entry?.budgetKey ? this.entry.budgetKey : '']
      }
    );
  }

  private fillFormIfEntryIsAvailable() {
    if (this.entry) {
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

  private createListeners() {
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
    });
    this.addOrEditEntryFormGroup.controls['value'].valueChanges.subscribe(value => {
      this.isValueInvalid = value <= 0;
    });
  }

  private loadAccounts() {
    this.accountService.getAllAccounts().subscribe(accounts => {
      accounts.forEach(accountRaw => {
        const account: Account = accountRaw.payload.val() as Account;
        account.key = accountRaw.key ? accountRaw.key : '';
        this.accounts.push(account);
      });
      if (!this.entry) {
        if (accounts.length == 0) {
          this.accounts.push(this.accountService.noAccountValue);
          this.addOrEditEntryFormGroup.controls['account'].setValue(this.accounts[0].key);
        }
        else if (this.userService.mainAccount) {
          this.addOrEditEntryFormGroup.controls['account'].setValue(this.userService.mainAccount.key);
        } else {
          if (this.accounts.length > 0) {
            this.addOrEditEntryFormGroup.controls['account'].setValue(this.accounts[0].key);
          }
        }
      }
    });
  }

  private loadBudgets() {
    this.budgets.push(this.noBudgetValue);
    if (!this.entry?.budgetKey) { this.addOrEditEntryFormGroup.controls['budget'].setValue(this.budgets[0].key); }
    this.budgetService.getAllMonthBudgetsByMonthString(this.dateService.getActualMonthString()).subscribe(budgets => {
      budgets.forEach(budgetRaw => {
        this.addBudgetToBudgets(budgetRaw);
      });
    });
    this.budgetService.getAllNoTimeLimitBudgets().subscribe(budgets => {
      budgets.forEach(budgetRaw => {
        this.addBudgetToBudgets(budgetRaw);
      });
    });
  }

  private addBudgetToBudgets(budgetRaw: SnapshotAction<any>) {
    const budget: Budget = budgetRaw.payload.val() as Budget;
    budget.key = budgetRaw.key ? budgetRaw.key : '';
    if (budget.limit! > 0) {
      this.budgets.push(budget);
    }
  }

  onDateSelected(ngbDate: NgbDate) {
    this.selectedDateTimestamp = this.dateService.getTimestampFromNgbDate(ngbDate);
  }

  onButtonDelete() {
    if (this.entry) {
      this.entryService.deleteEntry(this.entry.key!).then(() => this.onClose.emit());
    }
  }

  onSubmit() {
    if (this.entry) {
      this.onEdit();
    } else {
      this.onAdd();
    }
  }

  onEdit() {
    if (this.entry!.key) {
      this.entryService.updateEntry(this.getEntryObject(), this.entry!.key).then(() => this.onClose.emit());
    }
  }

  onAdd() {
    this.entryService.addEntry(this.getEntryObject()).then(() => this.onClose.emit());
  }

  getEntryObject(): Entry {
    const name: string = this.addOrEditEntryFormGroup.value.name;
    const value: number = this.addOrEditEntryFormGroup.value.value;
    const entry: Entry = {
      type: this.selectedEntryType.value,
      name: name,
      searchName: this.helperService.createSearchName(name),
      value: value,
      date: this.selectedDateTimestamp,
      account: this.selectedAccount,
      budgetKey: this.selectedBudget ? this.selectedBudget.key : undefined,
      monthString: this.dateService.getMonthStringFromDate(new Date(this.selectedDateTimestamp))
    }
    if (entry.budgetKey) {
      return entry;
    } else {
      delete entry['budgetKey'];
      return entry;
    }
  }

  onButtonCancel() {
    this.onClose.emit();
  }

  get selectedAccount(): Account {
    const account = this.accounts.find((account: Account) => account.key === this.addOrEditEntryFormGroup.value.account);
    return account ? account : this.accountService.noAccountValue;
  }

  get selectedBudget() {
    const budget = this.budgets.find((budget: Budget) => budget.key === this.addOrEditEntryFormGroup.value.budget);
    if (budget && budget.key === this.noBudgetKey) {
      return undefined;
    }
    return budget;
  }
}
