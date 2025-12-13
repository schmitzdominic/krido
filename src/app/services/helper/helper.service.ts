import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  /**
   * Creates a lowercase search key from a string, removing all whitespace.
   * Umlauts and other special characters are preserved.
   * @param name The input string.
   * @returns A normalized string suitable for searching.
   */
  public createSearchName(name: string): string {
    if (!name) {
      return '';
    }
    return name.replace(/\s/g, '').toLowerCase();
  }
}
