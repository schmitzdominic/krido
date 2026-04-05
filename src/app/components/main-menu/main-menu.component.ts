import { Component, inject } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {NavigationEnd, Router} from "@angular/router";
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { HomeUIService } from '../../services/home/home-ui.service';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    standalone: false
})
export class MainMenuComponent {
  protected menuTitleService = inject(MenuTitleService);
  protected homeUIService = inject(HomeUIService);
  private router = inject(Router);

  readonly isOnHome = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects.startsWith('/home')),
      startWith(this.router.url.startsWith('/home'))
    ),
    { initialValue: this.router.url.startsWith('/home') }
  );

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
