import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {Account} from "../../../../../shared/interfaces/account.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {DateService} from "../../../../services/date/date.service";
import {AccountService} from "../../../../services/account/account.service";

@Component({
    selector: 'app-update-account-value',
    templateUrl: './update-account-value.component.html',
    styleUrls: ['./update-account-value.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateAccountValueComponent {
  private formBuilder = inject(FormBuilder);
  private dateService = inject(DateService);
  private ngbCalendar = inject(NgbCalendar);
  private accountService = inject(AccountService);


  @Input() account: Account | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  selectedDate: NgbDate = this.ngbCalendar.getToday();
  selectedDateTimestamp: number = this.dateService.getTimestampFromNgbDate(this.selectedDate);

  isValueInvalid: boolean = false;

  updateAccountValueFormGroup: FormGroup = new FormGroup({
    date: new FormControl(''),
    value: new FormControl(''),
  });

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  ngOnInit() {
    this.createFormGroup();
    this.createListener();
  }

  private createFormGroup() {
    this.updateAccountValueFormGroup = this.formBuilder.group(
      {
        date: [this.selectedDate],
        value: [''],
      }
    );
  }

  createListener() {
    this.updateAccountValueFormGroup.controls['value'].valueChanges.subscribe((value: number) => {
        return this.isValueInvalid = value === null || value === undefined;
    });
  }

  onDateSelected(ngbDate: NgbDate) {
    this.selectedDateTimestamp = this.dateService.getTimestampFromNgbDate(ngbDate);
  }

  get value() {
    return this.updateAccountValueFormGroup.value.value;
  }

  onSubmit() {
    this.accountService.setValue(this.selectedDateTimestamp, this.value, this.account!.id!).then(() => this.onClose.emit());
  }

  onButtonCancel() {
    this.onClose.emit();
  }

}
