import {Injectable} from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

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

  private dayNamesShort = [
    "So.",
    "Mo.",
    "Di.",
    "Mi.",
    "Do.",
    "Fr.",
    "Sa."
  ];

  constructor() { }

  /**
   * Get the actual Date (browser date)
   */
  getActualDate(): Date {
    return this.actualDate;
  }

  /**
   * Get the last Day of month.
   *
   * @param {Date} date to get the last day
   * @returns {number} last day
   */
  setDateToLastDayOfMonth(date: Date): number {
    date = new Date(date.getFullYear(), date.getMonth()+1, 0);
    return date.getDate();
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
   * Gets the day by a day number.
   *
   * @param {number} day starts from 0
   * @returns {string} the day as short
   */
  getDayShortName(day: number): string {
    return this.dayNamesShort[day];
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
   * Gets the actual day timestamp.
   *
   * @returns {number} actual day as timestamp
   */
  getActualDayTimestamp(): number {
    return new Date(this.actualDate.getFullYear(), this.actualDate.getMonth(), this.actualDate.getDate()).getTime();
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
    return this.getMonthStringFromDate(this.actualDate);
  }

  /**
   * Get a month string from the actual Month + offset
   *
   * @param {number} offset to set
   * @returns {string} month string
   */
  getMonthStringFromMonth(offset: number): string {
    const actualMonth: number = new Date().getMonth();
    const actualYear: number = new Date().getFullYear();
    const year: number = actualMonth + offset > 11 ? actualYear + 1 : actualYear;
    const month: number = (new Date().getMonth() + offset)%12;
    return this.getMonthStringFromDate(new Date(year, month, 1));
  }

  /**
   * Gets the number of the next month.
   *
   * @returns {number} of the next month
   */
  getNextMonthNumber(): number {
    return (new Date().getMonth()+1)%12;
  }

  /**
   * Set the next month on a date object.
   *
   * @param {Date} date object to set
   */
  setNextMonth(date: Date) {
    const monthStringFromMonth: string = this.getMonthStringFromMonth(1);
    const month: number = Number(monthStringFromMonth.slice(-2));
    const year: number = Number(monthStringFromMonth.slice(0, 4));
    date.setFullYear(year);
    date.setMonth(month);
  }

  /**
   * Get a month string from Date object.
   *
   * @param {Date} date to convert.
   * @returns {string} monthString
   */
  getMonthStringFromDate(date: Date): string {
    const month: string = String(date.getMonth());
    const year: string = String(date.getFullYear());
    return year + (month.length == 1 ? '0' + month : month);
  }

  /**
   * Get a Timestamp from NgbDate object.
   *
   * @param {NgbDate} ngbDate to convert to timestamp
   * @returns {number} timestamp
   */
  getTimestampFromNgbDate(ngbDate: NgbDate): number {
    const date: Date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    return date.getTime();
  }

  /**
   * Get Date Object from timestamp.
   *
   * @param {number} timestamp to convert.
   * @returns {Date} from timestamp
   */
  getDateFromTimestamp(timestamp: number): Date {
    return new Date(timestamp);
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

  /**
   * Gets the next available weekday (date of month) from date.
   *
   * saturday or sunday before month change -> friday before
   * sunday no month change -> monday
   * saturday no month change -> friday
   *
   * @param {number} timestamp to check
   * @return {number} timestamp as described
   */
  getAvailableWeekdayAsTimestampFromTimestamp(timestamp: number): number {

    const date: Date = this.getDateFromTimestamp(timestamp);

    // If it is already a weekday
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      return date.getTime();

    } else {

      const lastDayInMonth: number = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      if (date.getDay() === 6) {
        // Saturday
        // If it is not Saturday the first -> Return the Friday before
        if (date.getDate() > 1) { date.setDate(date.getDate() - 1); }
        // Else it is Saturday the first -> Return the next Monday -> 1. Saturday, 2. Sunday, -> 3. Monday
        else { date.setDate(3); }
      } else {
        // Sunday
        // If it is not Sunday the last of the month -> Return the monday after
        if (date.getDate() < lastDayInMonth) { return date.setDate(date.getDate() + 1); }
        // Else it is Sunday the last of the month -> Return the Friday before -> last day. Sunday, -1 Saturday, -2 Friday
        else { return date.setDate(date.getDate() - 2); }
      }

      return date.getTime();
    }
  }
}
