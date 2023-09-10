import {Component} from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";

@Component({
  selector: 'app-regularly',
  templateUrl: './regularly.component.html',
  styleUrls: ['./regularly.component.scss']
})
export class RegularlyComponent {

  active: string = 'regularly';

  constructor(private menuTitleService: MenuTitleService) {
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Regelmäßig');
    this.menuTitleService.setActiveId(2);
  }
}
