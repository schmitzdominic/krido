import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Budget} from "../../../../../shared/interfaces/budget.model";
import {PriceService} from "../../../../services/price/price.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {ProgressBarService} from "../../../../services/progress-bar/progress-bar.service";

@Component({
  selector: 'app-view-budget-content',
  templateUrl: './view-budget-content.component.html',
  styleUrls: ['./view-budget-content.component.scss']
})
export class ViewBudgetContentComponent {

  @Input() budget: Budget | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  isContentReadOnly: boolean = true;
  isEditButtonShown: boolean = true;

  constructor(private ngbProgressbarConfig: NgbProgressbarConfig,
              public progressBarService: ProgressBarService,
              public priceService: PriceService) {
  }

  ngOnInit(): void {
    this.checkIfLimitIsSet();
    this.loadProgressBarConfig();
  }

  checkIfLimitIsSet() {
    if (!this.budget?.limit) {
      this.isEditButtonShown = false;
      this.onEdit();
    }
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

  onCancel() {
    this.onClose.emit();
  }

}
