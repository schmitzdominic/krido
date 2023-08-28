import {Component, Input} from '@angular/core';
import {Budget} from "../../../entities/budget.model";
import {ProgressBarService} from "../../../services/progress-bar/progress-bar.service";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {PriceService} from "../../../services/price/price.service";

@Component({
  selector: 'app-budget-list-entry',
  templateUrl: './budget-list-entry.component.html',
  styleUrls: ['./budget-list-entry.component.scss']
})
export class BudgetListEntryComponent {

  @Input({ required: true }) budget: Budget | undefined;

  constructor(private ngbProgressbarConfig: NgbProgressbarConfig,
              public progressBarService: ProgressBarService,
              public priceService: PriceService) {
  }

  ngOnInit() {
    this.progressBarService.setProgressBarConfig(this.ngbProgressbarConfig);
  }

}
