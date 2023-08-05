import {ChangeDetectorRef, Component} from '@angular/core';
import {MenuTitleService} from "../../behavior/menu-title/menu-title.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {

  title?: string;
  activeId: number = 1;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private router: Router,
              private menuTitleService: MenuTitleService) {
  }

  ngOnInit(): void {
    this.subscribeBehaviors();
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Subscribe all behaviors
   */
  subscribeBehaviors(): void {
    this.menuTitleService.title.subscribe(newTitle => {
      this.title = newTitle;
    });
    this.menuTitleService.activeId.subscribe(newActiveId => {
      this.activeId = newActiveId;
    })
  }

  navigateToAccounts(): void {
    this.router.navigate(['/accounts']).then(r => true);
  }
  navigateToActualMonth(): void {
    this.router.navigate(['/actual-month']).then(r => true);
  }

  navigateToBudgets(): void {
    this.router.navigate(['/budgets']).then(r => true);
  }

  navigateToExpenditures(): void {
    this.router.navigate(['/expenditures']).then(r => true);
  }

  navigateToRegularly(): void {
    this.router.navigate(['/regularly']).then(r => true);
  }
}
