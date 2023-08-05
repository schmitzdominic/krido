import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuTitleService {

  title = new BehaviorSubject('');
  activeId = new BehaviorSubject(0);

  constructor() { }

  /**
   * Set new Title.
   *
   * @param newTitle to set
   */
  setTitle(newTitle: string): void {
    this.title.next(newTitle);
  }

  /**
   * Set new ActiveId
   *
   * @param {number} newActiveId to set
   */
  setActiveId(newActiveId: number): void {
    this.activeId.next(newActiveId);
  }
}
