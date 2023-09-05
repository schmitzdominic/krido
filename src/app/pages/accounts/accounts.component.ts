import { Component } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

  active: string = 'accounts';

  constructor(private menuTitleService: MenuTitleService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Konten');
    this.menuTitleService.setActiveId(4);
  }
}
