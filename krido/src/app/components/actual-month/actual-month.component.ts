import {Component} from '@angular/core';
import {DateService} from "../../services/date-service/date.service";
import {MenuTitleService} from "../../behavior/menu-title/menu-title.service";

@Component({
  selector: 'app-actual-month',
  templateUrl: './actual-month.component.html',
  styleUrls: ['./actual-month.component.scss']
})
export class ActualMonthComponent {

  constructor(private menuTitleService: MenuTitleService,
              private dateService: DateService) {
  }
  ngOnInit(): void {
    this.setInitialValues();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle(this.dateService.getActualMonthName() + ' ' + this.dateService.getActualYear());
    this.menuTitleService.setActiveId(1);
  }

}
