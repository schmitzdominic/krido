import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EntryType} from "../../../../shared/enums/entry-type.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegularlyCycleType} from "../../../../shared/enums/regularly-cycle-type.enum";
import {Account} from "../../../../shared/interfaces/account.model";
import {AccountService} from "../../../services/account/account.service";
import {Regularly} from "../../../../shared/interfaces/regularly.model";
import {HelperService} from "../../../services/helper/helper.service";
import {RegularlyService} from "../../../services/regularly/regularly.service";
import {RegularlyType} from "../../../../shared/enums/regularly-type.enum";
import {NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {DateService} from "../../../services/date/date.service";
import {Entry} from "../../../../shared/interfaces/entry.model";
import {EntryService} from "../../../services/entry/entry.service";

interface EntryTypeInterface {
  value: EntryType,
  label: string,
}

interface CycleTypeInterface {
  value: RegularlyCycleType,
  label: string,
}

@Component({
  selector: 'app-add-or-edit-regularly',
  templateUrl: './add-or-edit-regularly.component.html',
  styleUrls: ['./add-or-edit-regularly.component.scss']
})
export class AddOrEditRegularlyComponent {

  @Input() regularly: Regularly | undefined;
  @Input() type: RegularlyType | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  expenditureEntryType: EntryTypeInterface = {value: EntryType.outcome, label: 'Ausgabe'};
  incomeEntryType: EntryTypeInterface = {value: EntryType.income, label: 'Einnahme'}
  selectedEntryType: EntryTypeInterface = this.expenditureEntryType;
  entryTypes: EntryTypeInterface[] = [this.expenditureEntryType, this.incomeEntryType];

  monthCycleType: CycleTypeInterface = {value: RegularlyCycleType.month, label: 'Monatlich'};
  quarterCycleType: CycleTypeInterface = {value: RegularlyCycleType.quarter, label: 'Quartal'}
  yearCycleType: CycleTypeInterface = {value: RegularlyCycleType.year, label: 'Jährlich'}
  selectedCycleType: CycleTypeInterface = this.monthCycleType;
  cycleTypes: CycleTypeInterface[] = [this.monthCycleType, this.yearCycleType]; // TODO: Add this.quarterCycleType

  selectedDate: NgbDate = this.ngbCalendar.getToday();
  selectedDateTimestamp: number = this.dateService.getTimestampFromNgbDate(this.selectedDate);


  accounts: Account[] = [];

  title: string = this.selectedEntryType.label;
  submitButtonText: string = 'Eintragen';

  isNameInvalid: boolean = true;
  isValueInvalid: boolean = true;
  isMonthDayInvalid: boolean = false;
  isLastDay: boolean = false;

  addOrEditRegularlyFormGroup: FormGroup = new FormGroup({
    entryType: new FormControl(''),
    cycleType: new FormControl(''),
    name: new FormControl('', Validators.required),
    value: new FormControl(''),
    monthDay: new FormControl(''),
    lastDay: new FormControl(''),
    account: new FormControl(''),
    date: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private helperService: HelperService,
              private regularlyService: RegularlyService,
              private dateService: DateService,
              private ngbCalendar: NgbCalendar,
              private entryService: EntryService) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.createListeners();
    this.loadAccounts();
    this.fillFormIfRegularlyIsAvailable();
    this.dateService.setDateToLastDayOfMonth(new Date(2023, 9));
  }

  private createFormGroup() {
    this.addOrEditRegularlyFormGroup = this.formBuilder.group(
      {
        entryType: [this.selectedEntryType.value],
        cycleType: [this.selectedCycleType.value],
        name: [this.regularly ? this.regularly.name : '', Validators.required],
        value: [this.regularly ? this.regularly.value : ''],
        monthDay: [1],
        lastDay: [this.regularly?.isEndOfMonth],
        account: [this.regularly ? this.regularly.account.key : ''],
        date: [''],
      }
    );
  }

  private fillFormIfRegularlyIsAvailable() {
    if (this.regularly) {

      this.isNameInvalid = false;
      this.isValueInvalid = false;
      this.isMonthDayInvalid = false;

      this.submitButtonText = 'Ändern'

      this.selectedEntryType = this.regularly.entryType === EntryType.income ? this.incomeEntryType : this.expenditureEntryType;
      this.title = this.regularly.entryType === EntryType.income ? this.incomeEntryType.label : this.expenditureEntryType.label;
      this.isLastDay = this.regularly.isEndOfMonth ? this.regularly.isEndOfMonth : false;

      switch(this.regularly.cycle) {
        case RegularlyCycleType.month: this.selectedCycleType = this.monthCycleType; break;
        case RegularlyCycleType.quarter: this.selectedCycleType = this.quarterCycleType; break;
        case RegularlyCycleType.year: this.selectedCycleType = this.yearCycleType; break;
      }

      this.addOrEditRegularlyFormGroup.controls['cycleType'].setValue(this.selectedCycleType.value);

      switch(this.regularly.cycle) {
        case RegularlyCycleType.month: {
          this.addOrEditRegularlyFormGroup.controls['monthDay'].setValue(this.regularly.monthDay);
          break;
        }
        case RegularlyCycleType.quarter: {
          this.addOrEditRegularlyFormGroup.controls['monthDay'].setValue(this.regularly.monthDay);
          break;
        }
        case RegularlyCycleType.year: {
          const date: Date = this.dateService.getDateFromTimestamp(this.regularly.date!);
          this.selectedDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
          this.selectedDateTimestamp = this.regularly.date!;
          break;
        }
      }
    }
  }

  private createListeners() {
    // Entry Type
    this.addOrEditRegularlyFormGroup.controls['entryType'].valueChanges.subscribe(entryTypeName => {
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
    // Cycle Type
    this.addOrEditRegularlyFormGroup.controls['cycleType'].valueChanges.subscribe(cycleTypeName => {
      switch (cycleTypeName) {
        case this.monthCycleType.value: {
          this.selectedCycleType = this.monthCycleType;
          break;
        }
        case this.quarterCycleType.value: {
          this.selectedCycleType = this.quarterCycleType;
          break;
        }
        case this.yearCycleType.value: {
          this.selectedCycleType = this.yearCycleType;
          this.isMonthDayInvalid = false;
          break;
        }
      }
      this.checkMonthDayValidity(this.addOrEditRegularlyFormGroup.value.monthDay);
    });
    // Form behavior
    this.addOrEditRegularlyFormGroup.controls['lastDay'].valueChanges.subscribe(lastDay => {
      this.isLastDay = lastDay;
    });
    // Validators
    this.addOrEditRegularlyFormGroup.controls['monthDay'].valueChanges.subscribe((monthDay: number) => {
      this.checkMonthDayValidity(monthDay);
    });
    this.addOrEditRegularlyFormGroup.controls['name'].valueChanges.subscribe((name: string) => {
      this.isNameInvalid = name.length <= 0;
    });
    this.addOrEditRegularlyFormGroup.controls['value'].valueChanges.subscribe(value => {
      this.isValueInvalid = value <= 0;
    });
  }

  private checkMonthDayValidity(monthDay: number) {
    if (!this.isLastDay && this.isMonthDayNeeded) {
      this.isMonthDayInvalid = !(monthDay > 0 && monthDay <= 28);
    } else {
      this.isMonthDayInvalid = false;
    }
  }

  private loadAccounts() {
    this.accountService.getAllAccounts().subscribe(accounts => {
      accounts.forEach(accountRaw => {
        const account: Account = accountRaw.payload.val() as Account;
        account.key = accountRaw.key ? accountRaw.key : '';
        this.accounts.push(account);
      });
      if (!this.regularly) {
        if (accounts.length > 0) {
          this.addOrEditRegularlyFormGroup.controls['account'].setValue(this.accounts[0].key);
        }
      }
    });
  }

  get isMonthDayNeeded() {
    return this.selectedCycleType === this.monthCycleType || this.selectedCycleType === this.quarterCycleType;
  }

  onDateSelected(ngbDate: NgbDate) {
    this.selectedDateTimestamp = this.dateService.getTimestampFromNgbDate(ngbDate);
  }

  onSubmit() {
    if (this.regularly) {
      this.onEdit();
    } else {
      this.onAdd();
    }
  }

  onAdd() {
    this.regularlyService.addRegularly(this.regularlyObject).then(() => {
      this.checkIfEntryMustBeCreated();
    });
  }

  onEdit() {
    this.regularlyService.updateRegularly(this.regularlyObject, this.regularly!.key!).then(() => {
      this.onClose.emit();
    });
  }

  get regularlyObject(): Regularly {
    const name: string = this.addOrEditRegularlyFormGroup.value.name;
    const value: number = this.addOrEditRegularlyFormGroup.value.value;
    const isEndOfMonth: boolean = this.addOrEditRegularlyFormGroup.value.lastDay;
    return {
      entryType: this.selectedEntryType.value,
      type: this.type,
      cycle: this.selectedCycleType.value,
      name: name,
      searchName: this.helperService.createSearchName(name),
      value: value,
      monthDay: this.monthDay,
      date: this.selectedCycleType === this.yearCycleType ? this.selectedDateTimestamp : 0,
      account: this.selectedAccount,
      isEndOfMonth: isEndOfMonth
    }
  }

  private get monthDay() {
    if (this.isMonthDayNeeded) {
      if (this.addOrEditRegularlyFormGroup.value.lastDay) {
        return 999;
      } else {
        return this.addOrEditRegularlyFormGroup.value.monthDay;
      }
    } else {
      return 999;
    }
  }

  private checkIfEntryMustBeCreated() {
    const actualDate: Date = new Date();
    const nextMonthDate: Date = this.dateForEntry;
    this.dateService.setNextMonth(nextMonthDate);
    switch(this.selectedCycleType.value) {
      case RegularlyCycleType.month: {
        const monthDay: number = this.addOrEditRegularlyFormGroup.value.monthDay;
        if (actualDate.getDate() <= monthDay) {
          // This month
          this.createEntry(this.dateForEntry);
        }
        // Next month
        this.createEntry(nextMonthDate);
        break;
      }
      case RegularlyCycleType.quarter: {
        // TODO: Implement to identify if we are at the moment in the cycle! If yes, create
        this.onClose.emit();
        break;
      }
      case RegularlyCycleType.year: {
        const selectedDate: Date = this.dateService.getDateFromTimestamp(this.selectedDateTimestamp);
        if (actualDate.getMonth() ==  selectedDate.getMonth() || this.dateService.getNextMonthNumber() == selectedDate.getMonth()) {
          this.createEntry(this.dateForEntry);
        } else {
          this.onClose.emit();
        }
      }
    }
  }

  private createEntry(date: Date) {
    this.entryService.addEntry(this.getEntryObject(date)).then(() => this.onClose.emit());
  }

  getEntryObject(date: Date): Entry {
    const name: string = this.addOrEditRegularlyFormGroup.value.name;
    const value: number = this.addOrEditRegularlyFormGroup.value.value;
    return {
      type: this.selectedEntryType.value,
      name: name,
      searchName: this.helperService.createSearchName(name),
      value: value,
      date: date.getTime(),
      account: this.selectedAccount,
      monthString: this.dateService.getMonthStringFromDate(date)
    }
  }

  private get dateForEntry(): Date {
    switch(this.selectedCycleType.value) {
      case RegularlyCycleType.month:
      case RegularlyCycleType.quarter: {
        const date: Date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
        if (this.isLastDay) {
          date.setDate(0);
        } else {
          date.setDate(this.addOrEditRegularlyFormGroup.value.monthDay);
        }
        return date;
      }
      case RegularlyCycleType.year: {
        return this.dateService.getDateFromTimestamp(this.selectedDateTimestamp);
      }
      default: return new Date();
    }
  }

  get selectedAccount(): Account {
    const account = this.accounts.find((account: Account) => account.key === this.addOrEditRegularlyFormGroup.value.account);
    return account ? account : this.accountService.noAccountValue;
  }

  onButtonDelete() {
    this.regularlyService.deleteRegularly(this.regularly!.key!).then(() => this.onClose.emit());
  }

  onButtonCancel() {
    this.onClose.emit();
  }
}
