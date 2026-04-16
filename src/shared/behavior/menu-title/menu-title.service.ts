import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuTitleService {

  readonly title = signal('');
  readonly activeId = signal(0);
  readonly isSearchActive = signal(false);
  readonly isSearchOpen = signal(false);
  readonly searchTerm = signal('');

  setTitle(newTitle: string): void {
    queueMicrotask(() => this.title.set(newTitle));
  }

  setActiveId(newActiveId: number): void {
    queueMicrotask(() => this.activeId.set(newActiveId));
  }

  setSearchActive(active: boolean): void {
    this.isSearchActive.set(active);
    if (!active) {
      this.isSearchOpen.set(false);
      this.searchTerm.set('');
    }
  }
}
