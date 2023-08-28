import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Budget} from "../../../../entities/budget.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PriceService} from "../../../../services/price/price.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {ProgressBarService} from "../../../../services/progress-bar/progress-bar.service";

@Component({
  selector: 'app-show-budget-content',
  templateUrl: './show-budget-content.component.html',
  styleUrls: ['./show-budget-content.component.scss']
})
export class ShowBudgetContentComponent {

  @Input() budget: Budget | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  isContentReadOnly: boolean = true;
  isEditButtonShown: boolean = true;

  editBudgetFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    limit: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder,
              private ngbProgressbarConfig: NgbProgressbarConfig,
              public progressBarService: ProgressBarService,
              public priceService: PriceService) {
    this.createFormGroup();
  }

  ngOnInit(): void {
    this.checkIfLimitIsSet();
    this.createFormGroup();
    this.loadProgressBarConfig();
  }

  checkIfLimitIsSet() {
    if (!this.budget?.limit) {
      this.isEditButtonShown = false;
      this.onEdit();
    }
  }

  createFormGroup(): void {
    this.editBudgetFormGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        limit: ['', Validators.required]
      }
    );
  }

  loadProgressBarConfig() {
    this.progressBarService.setProgressBarConfig(this.ngbProgressbarConfig);
  }

  getRestBudget() {
    if (this.budget!.limit && this.budget?.usedLimit) {
      const restBudget: number = this.budget.limit - this.budget.usedLimit;
      return this.priceService.convertNumberToEuro(restBudget);
    } else {
      return this.budget?.limit ? this.priceService.convertNumberToEuro(this.budget?.limit) : 'N/A';
    }
  }

  getProgressBarText() {
    if ((this.budget?.usedLimit! / this.budget?.limit! * 100) < 35) {
      return '';
    } else {
      return this.priceService.convertNumberToEuro(this.budget?.usedLimit!)
        + ' / ' +
        this.priceService.convertNumberToEuro(this.budget?.limit!);
    }
  }

  onEdit() {
    this.isContentReadOnly = !this.isContentReadOnly;
  }

  onSubmit(): void {

  }

  onCancel() {
    this.onClose.emit();
  }

}
