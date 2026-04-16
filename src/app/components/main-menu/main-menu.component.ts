import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    standalone: false
})
export class MainMenuComponent {
  protected menuTitleService = inject(MenuTitleService);
  private router = inject(Router);

  @ViewChild('searchInput') private searchInput: ElementRef<HTMLInputElement> | undefined;

  toggleSearch(): void {
    const isOpen = this.menuTitleService.isSearchOpen();
    if (isOpen) {
      this.menuTitleService.isSearchOpen.set(false);
      this.menuTitleService.searchTerm.set('');
    } else {
      this.menuTitleService.isSearchOpen.set(true);
      this.searchInput?.nativeElement.focus();
    }
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
