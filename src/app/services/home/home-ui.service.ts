import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { DateService } from '../date/date.service';

@Injectable({ providedIn: 'root' })
export class HomeUIService {
  private dateService = inject(DateService);
  private readonly STORAGE_KEY = 'accounts-enabled-month';

  readonly isAccountsExpanded: WritableSignal<boolean>;
  readonly isSearchActive = signal<boolean>(false);
  readonly searchQuery = signal<string>('');

  constructor() {
    const today = new Date().getDate();
    const currentMonth = this.dateService.getActualMonthString();
    const enabledMonth = localStorage.getItem(this.STORAGE_KEY);
    this.isAccountsExpanded = signal(today <= 3 || enabledMonth === currentMonth);
  }

  requestShowAccounts(): void {
    this.isAccountsExpanded.set(true);
    localStorage.setItem(this.STORAGE_KEY, this.dateService.getActualMonthString());
  }

  hideAccounts(): void {
    this.isAccountsExpanded.set(false);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  toggleSearch(): void {
    const next = !this.isSearchActive();
    this.isSearchActive.set(next);
    if (!next) {
      this.searchQuery.set('');
    }
  }
}
