import {ChangeDetectorRef, Component} from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
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
    });
  }

  navigateToAccounts(): void {
    this.router.navigate(['/accounts']);
  }
  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToBudgets(): void {
    this.router.navigate(['/budgets']);
  }

  navigateToHistory(): void {
    this.router.navigate(['/history']);
  }

  navigateToRegularly(): void {
    this.router.navigate(['/regularly']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
