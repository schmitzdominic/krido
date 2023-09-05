import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  private actualDate = new Date();
  private monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ];

  constructor() { }

  /**
   * Get the actual Date (browser date)
   */
  getActualDate(): Date {
    return this.actualDate;
  }

  /**
   * Gets the month name by a monthString.
   *
   * @param {String} monthString e.g. 202201 -> Januar
   * @returns {string} Month Name
   */
  getMonthName(monthString: String): string {
    const monthNumber: number = Number(monthString.slice(-2));
    return this.monthNames[monthNumber];
  }

  /**
   * Get the actual month name (browser date)
   */
  getActualMonthName(): string {
    return this.monthNames[this.actualDate.getMonth()];
  }

  /**
   * Gets the actual month as short name. e.g. Jan. -> January
   *
   * @returns {string}
   */
  getActualMonthShortName(): string {
    return this.getActualMonthName().substring(0,3) + '.';
  }

  /**
   * Gets the month as short name, by a given month. e.g. Jan. -> January
   *
   * @param {number} month to get the short name from
   * @returns {string} short month name
   */
  getMonthShortName(month: number): string {
    return this.monthNames[month].substring(0,3) + '.';
  }

  /**
   * Gets the year name by a monthString.
   *
   * @param {String} monthString e.g. 202201
   * @returns {number} Year
   */
  getYear(monthString: string): number {
    return Number(monthString.slice(0, 4));
  }

  /**
   * Get the actual year (browser date)
   */
  getActualYear(): number {
    return this.actualDate.getFullYear();
  }

  /**
   * Get the actual year + month
   *
   * @returns {string} year + month e.g. 202301
   */
  getActualMonthString(): string {
    const month: string = String(this.actualDate.getMonth());
    const year: string = String(this.actualDate.getFullYear());
    return year + (month.length == 1 ? '0' + month : month);
  }

  /**
   * Is the given monthString the actual month?
   *
   * true -> yes
   * false -> no
   *
   * @param {string} monthString to check for
   * @returns {boolean} true -> actual month, false -> not the actual month
   */
  isActualMonth(monthString: string): boolean {
    if (monthString.length == 6) {
      return this.getActualMonthString() == monthString;
    }
    return false;
  }
}
