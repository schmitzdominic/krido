import { Component } from '@angular/core';
import {MenuTitleService} from "../../behavior/menu-title/menu-title.service";

@Component({
  selector: 'app-expenditures',
  templateUrl: './expenditures.component.html',
  styleUrls: ['./expenditures.component.scss']
})
export class ExpendituresComponent {

  constructor(private menuTitleService: MenuTitleService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Ausgaben');
    this.menuTitleService.setActiveId(3);
  }
}
