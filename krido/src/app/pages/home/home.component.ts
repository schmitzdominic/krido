import {Component} from '@angular/core';
import {DateService} from "../../services/date/date.service";
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";

@Component({
  selector: 'app-actual-month',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  actualMonth = this.dateService.getActualMonthName();
  actualYear = this.dateService.getActualYear();

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
    this.menuTitleService.setTitle(this.actualMonth + ' ' + this.actualYear);
    this.menuTitleService.setActiveId(1);
  }

  onButtonAddClick() {

  }
}
