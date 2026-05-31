import {Injectable} from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

/**
 * A service for common date and time operations.
 */
@Injectable({
  providedIn: 'root'
})
export class DateService {

  /**
   * Returns a new Date object representing the current date and time.
   * This ensures that all date calculations are based on the moment of the call.
   */
  private get actualDate(): Date { return new Date(); }
  private readonly monthNames = [
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

  private readonly dayNamesShort = [
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
   * Gets the current Date.
   * @returns {Date} The current date.
   */
  public getActualDate(): Date {
    return this.actualDate;
  }

  /**
   * Gets the current year.
   * @returns {number} The current year.
   */
  public getActualYear(): number {
    return this.actualDate.getFullYear();
  }

  /**
   * Gets the name of the current month.
   * @returns {string} The full name of the current month.
   */
  public getActualMonthName(): string {
    return this.monthNames[this.actualDate.getMonth()];
  }

  /**
   * Gets the current year and month as a string in 'YYYYMM' format.
   * @returns {string} The current year and month (e.g., '202301' for January 2023).
   */
  public getActualMonthString(): string {
    return this.getMonthStringFromDate(this.actualDate);
  }

  /**
   * Gets the timestamp for the beginning of the current day (00:00:00).
   * @returns {number} The timestamp for the start of the current day.
   */
  public getActualDayTimestamp(): number {
    const now = this.actualDate;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }

  /**
   * Gets the number of the next month (0-11).
   * @returns {number} The number of the next month.
   */
  public getNextMonthNumber(): number {
    return (this.actualDate.getMonth() + 1) % 12;
  }

  // --- Converters and Formatters ---

  /**
   * Gets a Date object from a timestamp.
   * @param {number} timestamp The timestamp to convert.
   * @returns {Date} The corresponding Date object.
   */
  public getDateFromTimestamp(timestamp: number): Date {
    return new Date(timestamp);
  }

  /**
   * Gets a timestamp from an NgbDate object.
   * @param {NgbDate} ngbDate The NgbDate to convert.
   * @returns {number} The corresponding timestamp.
   */
  public getTimestampFromNgbDate(ngbDate: NgbDate): number {
    // NgbDate month is 1-based, Date month is 0-based.
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day).getTime();
  }

  /**
   * Gets a month string ('YYYYMM') from a Date object.
   * @param {Date} date The date to convert.
   * @returns {string} The month string.
   */
  public getMonthStringFromDate(date: Date): string {
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${year}${month < 10 ? '0' : ''}${month}`;
  }

  /**
   * Gets a month string from the current month plus a given offset.
   * @param {number} offset The number of months to add (can be negative).
   * @returns {string} The resulting month string in 'YYYYMM' format.
   */
  public getMonthStringFromMonth(offset: number): string {
    const date = this.actualDate;
    date.setDate(1);
    date.setMonth(date.getMonth() + offset);
    return this.getMonthStringFromDate(date);
  }

  /**
   * Gets the year from a month string ('YYYYMM').
   * @param {string} monthString The month string (e.g., '202201').
   * @returns {number} The year.
   */
  public getYear(monthString: string): number {
    return Number(String(monthString).slice(0, 4));
  }

  /**
   * Gets the 0-based month index from a month string ('YYYYMM').
   * @param {string} monthString The month string (e.g., '202604').
   * @returns {number} The 0-based month index (0=January, 3=April, etc.).
   */
  public getMonthIndex(monthString: string): number {
    return Number(String(monthString).slice(-2));
  }

  /**
   * Gets the month name from a month string (e.g., '202201' -> 'Januar').
   * @param {string} monthString The month string in 'YYYYMM' format.
   * @returns {string} The full name of the month.
   */
  public getMonthName(monthString: string): string {
    const monthIndex: number = Number(String(monthString).slice(-2));
    return this.monthNames[monthIndex];
  }

  /**
   * Gets the short name of a month by its number (0=January, ...).
   * @param {number} month The month number (0-11).
   * @returns {string} The short name of the month (e.g., 'Jan.').
   */
  public getMonthShortName(month: number): string {
    return this.monthNames[month].substring(0, 3) + '.';
  }

  /**
   * Gets the short name of a day of the week by its number (0=Sunday, ...).
   * @param {number} day The day number (0-6).
   * @returns {string} The short name of the day (e.g., 'So.').
   */
  public getDayShortName(day: number): string {
    return this.dayNamesShort[day];
  }

  /**
   * Checks if the given month string corresponds to the current month.
   * @param {string} monthString The month string to check.
   * @returns {boolean} True if it is the current month, false otherwise.
   */
  public isActualMonth(monthString: string): boolean {
    return this.getActualMonthString() === monthString;
  }

  // --- Date Manipulation ---

  /**
   * Gets the last day of the month for a given date.
   * @param {Date} date The date for which to find the last day of the month.
   * @returns {number} The last day of the month (e.g., 31).
   */
  public getLastDayOfMonth(date: Date): number {
    // By creating a date for day 0 of the next month, we get the last day of the given month.
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  /**
   * Modifies a Date object by setting it to the next month.
   * @param {Date} date The Date object to modify.
   */
  public setNextMonth(date: Date): void {
    date.setMonth(date.getMonth() + 1);
  }

  /**
   * Gets the nearest available weekday for a given timestamp, adjusting for weekends.
   * - Saturday moves to the previous Friday (unless it's the 1st, then it moves to the next Monday).
   * - Sunday moves to the next Monday (unless it's the last day of the month, then it moves to the previous Friday).
   * @param {number} timestamp The timestamp to check.
   * @returns {number} The timestamp of the nearest available weekday.
   */
  public getAvailableWeekdayAsTimestampFromTimestamp(timestamp: number): number {
    const date: Date = this.getDateFromTimestamp(timestamp);
    const dayOfWeek = date.getDay(); // 0=Sunday, 6=Saturday

    if (dayOfWeek > 0 && dayOfWeek < 6) {
      // It's already a weekday (Monday-Friday)
      return date.getTime();
    }

    if (dayOfWeek === 6) { // Saturday
      if (date.getDate() > 1) {
        date.setDate(date.getDate() - 1); // Move to Friday
      } else {
        date.setDate(date.getDate() + 2); // Move to Monday (from 1st to 3rd)
      }
    } else if (dayOfWeek === 0) { // Sunday
      const lastDayInMonth = this.getLastDayOfMonth(date);
      if (date.getDate() < lastDayInMonth) {
        date.setDate(date.getDate() + 1); // Move to Monday
      } else {
        date.setDate(date.getDate() - 2); // Move to Friday
      }
    }

    return date.getTime();
  }
}
