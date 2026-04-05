import { Component, inject } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";

@Component({
    selector: 'app-regularly',
    templateUrl: './regularly.component.html',
    styleUrls: ['./regularly.component.scss'],
    standalone: false
})
export class RegularlyComponent {
  private menuTitleService = inject(MenuTitleService);


  active: string = 'regularly';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Regelmäßig');
    this.menuTitleService.setActiveId(4);
  }
}
