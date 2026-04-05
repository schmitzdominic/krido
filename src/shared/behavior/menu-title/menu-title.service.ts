import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuTitleService {

  readonly title = signal('');
  readonly activeId = signal(0);

  setTitle(newTitle: string): void {
    queueMicrotask(() => this.title.set(newTitle));
  }

  setActiveId(newActiveId: number): void {
    queueMicrotask(() => this.activeId.set(newActiveId));
  }
}
