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
  cycleTypes: CycleTypeInterface[] = [this.monthCycleType, this.quarterCycleType, this.yearCycleType];

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
              private ngbCalendar: NgbCalendar) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.createListeners();
    this.loadAccounts();
  }

  private createFormGroup() {
    this.addOrEditRegularlyFormGroup = this.formBuilder.group(
      {
        entryType: [this.selectedEntryType.value],
        cycleType: [this.selectedCycleType.value],
        name: ['', Validators.required],
        value: [''],
        monthDay: [1],
        lastDay: [''],
        account: [''],
        date: [''],
      }
    );
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
    this.regularlyService.addRegularly(this.regularlyObject).then(() => this.onClose.emit());
  }

  onEdit() {

  }

  get regularlyObject(): Regularly {
    const name: string = this.addOrEditRegularlyFormGroup.value.name;
    const value: number = this.addOrEditRegularlyFormGroup.value.value;
    return {
      entryType: this.selectedEntryType.value,
      type: this.type,
      cycle: this.selectedCycleType.value,
      name: name,
      searchName: this.helperService.createSearchName(name),
      value: value,
      monthDay: this.isMonthDayNeeded ? this.addOrEditRegularlyFormGroup.value.monthDay : 0,
      date: this.selectedCycleType === this.yearCycleType ? this.selectedDateTimestamp : 0,
      account: this.selectedAccount,
      isEndOfMonth: this.addOrEditRegularlyFormGroup.value.lastDay
    }
  }

  get selectedAccount(): Account {
    const account = this.accounts.find((account: Account) => account.key === this.addOrEditRegularlyFormGroup.value.account);
    return account ? account : this.accountService.noAccountValue;
  }

  onButtonCancel() {
    this.onClose.emit();
  }
}
