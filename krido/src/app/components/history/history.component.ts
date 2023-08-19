import { Component } from '@angular/core';
import {MenuTitleService} from "../../behavior/menu-title/menu-title.service";

@Component({
  selector: 'app-expenditures',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  constructor(private menuTitleService: MenuTitleService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Historie');
    this.menuTitleService.setActiveId(3);
  }
}
