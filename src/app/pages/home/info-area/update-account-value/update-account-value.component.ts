import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Account} from "../../../../../shared/interfaces/account.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {DateService} from "../../../../services/date/date.service";
import {AccountService} from "../../../../services/account/account.service";

@Component({
  selector: 'app-update-account-value',
  templateUrl: './update-account-value.component.html',
  styleUrls: ['./update-account-value.component.scss']
})
export class UpdateAccountValueComponent {

  @Input() account: Account | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  selectedDate: NgbDate = this.ngbCalendar.getToday();
  selectedDateTimestamp: number = this.dateService.getTimestampFromNgbDate(this.selectedDate);

  isValueInvalid: boolean = true;

  updateAccountValueFormGroup: FormGroup = new FormGroup({
    date: new FormControl(''),
    value: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder,
              private dateService: DateService,
              private ngbCalendar: NgbCalendar,
              private accountService: AccountService) {
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
        return this.isValueInvalid = !value;
    });
  }

  onDateSelected(ngbDate: NgbDate) {
    this.selectedDateTimestamp = this.dateService.getTimestampFromNgbDate(ngbDate);
  }

  get value() {
    return this.updateAccountValueFormGroup.value.value;
  }

  onSubmit() {
    this.accountService.setValue(this.selectedDateTimestamp, this.value, this.account!.key!).then(() => this.onClose.emit());
  }

  onButtonCancel() {
    this.onClose.emit();
  }

}
