import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuTitleService {

  title = new BehaviorSubject('');

  constructor() { }

  /**
   * Set new Title.
   *
   * @param newTitle to set
   */
  setTitle(newTitle: string): void {
    this.title.next(newTitle);
  }
}
