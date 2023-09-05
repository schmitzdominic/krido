import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EntryType} from "../../../../../shared/enums/entry-type.enum";
import {AccountService} from "../../../../services/account/account.service";
import {Account} from "../../../../../shared/interfaces/account.model";
import {UserService} from "../../../../services/user/user.service";
import {AccountType} from "../../../../../shared/enums/account-type.enum";
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {BudgetService} from "../../../../services/budget/budget.service";
import {SnapshotAction} from "@angular/fire/compat/database";
import {DateService} from "../../../../services/date/date.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

interface EntryTypeInterface {
  name: EntryType,
  label: string,
}
@Component({
  selector: 'app-add-or-edit-entry',
  templateUrl: './add-or-edit-entry.component.html',
  styleUrls: ['./add-or-edit-entry.component.scss']
})
export class AddOrEditEntryComponent {

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  expenditureEntryType: EntryTypeInterface = {name: EntryType.outcome, label: 'Ausgabe'};
  incomeEntryType: EntryTypeInterface = {name: EntryType.income, label: 'Einnahme'}
  selectedEntryType: EntryTypeInterface = this.expenditureEntryType;
  entryTypes: EntryTypeInterface[] = [this.expenditureEntryType, this.incomeEntryType]
  accounts: Account[] = [];
  budgets: Budget[] = [];
  noBudgetKey: string = 'noBudget';
  selectedDate: number = Date.now();

  addOrEditEntryFormGroup: FormGroup = new FormGroup({
    entryType: new FormControl(''),
    name: new FormControl('', Validators.required),
    value: new FormControl('', Validators.required),
    date: new FormControl(''),
    account: new FormControl(''),
    budget: new FormControl(''),
  });

  noAccountValue: Account = {
    key: 'key',
    name: 'Kein Konto angelegt',
    searchName: 'keinKontoAngelegt',
    owners: [this.userService.user],
    accountType: AccountType.giro
  }

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
              private dateService: DateService) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.createListeners();
    this.loadAccounts();
    this.loadBudgets();
  }

  private createFormGroup() {
    this.addOrEditEntryFormGroup = this.formBuilder.group(
      {
        entryType: [this.selectedEntryType.name],
        name: ['', Validators.required],
        value: ['', Validators.required],
        date: [''],
        account: [''],
        budget: ['']
      }
    );
  }

  private createListeners() {
    this.addOrEditEntryFormGroup.controls['entryType'].valueChanges.subscribe(entryTypeName => {
      switch (entryTypeName) {
        case this.expenditureEntryType.name: {
          this.selectedEntryType = this.expenditureEntryType;
          break;
        }
        case this.incomeEntryType.name: {
          this.selectedEntryType = this.incomeEntryType;
          break;
        }
      }
      this.title = this.selectedEntryType.label;
    });
  }

  private loadAccounts() {
    this.accountService.getAllAccounts().subscribe(accounts => {
      accounts.forEach(accountRaw => {
        const account: Account = accountRaw.payload.val() as Account;
        account.key = accountRaw.key ? accountRaw.key : '';
        this.accounts.push(account);
      });
      if (accounts.length == 0) {
        this.accounts.push(this.noAccountValue);
        this.addOrEditEntryFormGroup.controls['account'].setValue(this.accounts[0].key);
      }
      if (this.userService.mainAccount) {
        this.addOrEditEntryFormGroup.controls['account'].setValue(this.userService.mainAccount.key);
      } else {
        if (this.accounts.length > 0) {
          this.addOrEditEntryFormGroup.controls['account'].setValue(this.accounts[0].key);
        }
      }
    });
  }

  private loadBudgets() {
    this.budgets.push(this.noBudgetValue);
    this.addOrEditEntryFormGroup.controls['budget'].setValue(this.budgets[0].key);
    this.budgetService.getAllThisMonthBudgets(this.dateService.getActualMonthString()).subscribe(budgets => {
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
    this.budgets.push(budget);
  }

  onDateSelected(date: NgbDate) {
    console.dir(date);
  }

  onSubmit() {

  }

  onButtonCancel() {
    this.onClose.emit();
  }

}
