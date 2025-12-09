import { Component, EventEmitter, inject, Injector, Input, Output, runInInjectionContext } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EntryType} from "../../../../../shared/enums/entry-type.enum";
import {AccountService} from "../../../../services/account/account.service";
import {Account} from "../../../../../shared/interfaces/account.model";
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {BudgetService} from "../../../../services/budget/budget.service";
import {DateService} from "../../../../services/date/date.service";
import {NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Entry} from "../../../../../shared/interfaces/entry.model";
import {HelperService} from "../../../../services/helper/helper.service";
import {EntryService} from "../../../../services/entry/entry.service";
import {forkJoin, map} from "rxjs";
import {UserService} from "../../../../services/user/user.service";

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
  private injector = inject(Injector);


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
        account: [this.entry ? (this.entry.account as any)?.id : ''],
        budget: [this.entry ? (this.entry.budget as any)?.id : ''],
        date: [this.entry ? this.entry.date : this.selectedDate]
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
    this.accountService.getAllAccounts().pipe(
      map(accounts => accounts as (Account & { id: string })[])
    ).subscribe(accounts => runInInjectionContext(this.injector, () => {
      this.accounts = accounts;
      if (!this.entry && accounts.length > 0) {
        this.addOrEditEntryFormGroup.controls['account'].setValue(accounts[0].id);
      }
    }));
  }

  private loadBudgets() {
    const monthString = this.dateService.getActualMonthString();
    const monthlyBudgets$ = this.budgetService.getAllMonthBudgetsByMonthString(monthString).pipe(map(b => b as (Budget & { id: string })[]));
    const allTimeBudgets$ = this.budgetService.getAllNoTimeLimitBudgets().pipe(map(b => b as (Budget & { id: string })[]));

    forkJoin([monthlyBudgets$, allTimeBudgets$]).subscribe(([monthlyBudgets, allTimeBudgets]) => runInInjectionContext(this.injector, () => {
      const activeBudgets = [...monthlyBudgets, ...allTimeBudgets].filter(budget => !budget.isArchived);
      this.budgets = [
        { ...this.noBudgetValue, id: this.noBudgetKey },
        ...activeBudgets
      ];

      if (!this.entry?.budget) {
        this.addOrEditEntryFormGroup.controls['budget'].setValue(this.noBudgetKey);
      }
    }));
  }

  onDateSelected(ngbDate: NgbDate) {
    this.selectedDateTimestamp = this.dateService.getTimestampFromNgbDate(ngbDate);
  }

  onButtonDelete() {
    this.entryService.deleteEntry(this.entry!.id).then(() => this.onClose.emit());
  }

  onSubmit() {
    if (this.entry) {
      this.onEdit();
    } else {
      this.onAdd();
    }
  }

  onEdit() {
    this.entryService.updateEntry(this.getEntryObject(), this.entry!.id).then(() => this.onClose.emit());
  }

  onAdd() {
    this.entryService.addEntry(this.getEntryObject()).then(() => this.onClose.emit());
  }

  getEntryObject(): Entry & { budget?: Budget } {
    const name: string = this.addOrEditEntryFormGroup.value.name;
    const value: number = this.addOrEditEntryFormGroup.value.value;
    return {
      type: this.selectedEntryType.value,
      name: name,
      searchName: this.helperService.createSearchName(name),
      value: value,
      date: this.selectedDateTimestamp,
      account: this.selectedAccount,
      budget: this.selectedBudget,
      monthString: this.dateService.getMonthStringFromDate(new Date(this.selectedDateTimestamp))
    }
  }

  onButtonCancel() {
    this.onClose.emit();
  }

  get selectedAccount(): Account {
    const account = this.accounts.find(acc => acc.id === this.addOrEditEntryFormGroup.value.account);
    return account ? account : this.accountService.noAccountValue;
  }

  get selectedBudget(): (Budget & { id: string }) | undefined {
    const budget = this.budgets.find(b => b.id === this.addOrEditEntryFormGroup.value.budget);
    if (budget?.id === this.noBudgetKey) {
      return undefined;
    }
    return budget;
  }
}
