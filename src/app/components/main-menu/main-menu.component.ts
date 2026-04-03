import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    standalone: false
})
export class MainMenuComponent {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private menuTitleService = inject(MenuTitleService);


  title?: string;
  activeId: number = 1;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  ngOnInit(): void {
    this.subscribeBehaviors();
  }

  /**
   * Subscribe all behaviors
   */
  subscribeBehaviors(): void {
    this.menuTitleService.title.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(newTitle => {
      this.title = newTitle;
    });
    this.menuTitleService.activeId.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(newActiveId => {
      this.activeId = newActiveId;
    });
  }

  navigateToAccounts(): void {
    this.router.navigate(['/accounts']);
  }
  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToInvoice(): void {
    this.router.navigate(['/invoice']);
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
