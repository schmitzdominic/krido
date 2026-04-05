import { Injectable, inject } from '@angular/core';
import {Budget} from "../../../shared/interfaces/budget.model";
import {DbService} from "../db.service";
import {Cycle} from "../../../shared/interfaces/cycle.model";
import {equalTo, orderByChild} from "firebase/database";

/**
 * Service for managing budgets (general, monthly) and cycles in the database.
 */
@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private dbService = inject(DbService);

  /**
   * Base path for all budget data in the database.
   */
  private get rootPath(): string {
    return `homes/${this.dbService.home}/budgets`;
  }

  /**
   * Path for general budgets with no time limit.
   */
  private get generalPath(): string {
    return `${this.rootPath}/general`;
  }

  /**
   * Path for monthly budgets.
   */
  private get monthPath(): string {
    return `${this.rootPath}/month`;
  }

  /**
   * Path for budget cycles.
   */
  private get cyclePath(): string {
    return `${this.rootPath}/cycle`;
  }

  /**
   * Adds a new general budget.
   * @param budget The budget object to add.
   * @returns A ThenableReference containing the key of the new entry.
   */
  public addBudget(budget: Budget) {
    return this.dbService.createListValue(this.generalPath, budget);
  }

  /**
   * Adds a new monthly budget.
   * @param budget The monthly budget object to add.
   * @returns A ThenableReference containing the key of the new entry.
   */
  public addMonthBudget(budget: Budget) {
    return this.dbService.createListValue(this.monthPath, budget);
  }

  /**
   * Adds a new budget cycle.
   * @param cycle The cycle object to add.
   * @returns A ThenableReference containing the key of the new entry.
   */
  public addCycle(cycle: (Cycle & { id: string })) {
    return this.dbService.createListValue(this.cyclePath, cycle);
  }

  /**
   * Deletes a general budget by its key.
   * @param key The unique key of the budget to delete.
   * @returns A promise that resolves on successful deletion.
   */
  public deleteBudget(key: string) {
    return this.dbService.delete(`${this.generalPath}/${key}`);
  }

  /**
   * Deletes a monthly budget by its key.
   * @param key The unique key of the monthly budget to delete.
   * @returns A promise that resolves on successful deletion.
   */
  public deleteMonthBudget(key: string) {
    return this.dbService.delete(`${this.monthPath}/${key}`);
  }

  /**
   * Deletes a budget cycle by its key.
   * @param key The unique key of the cycle to delete.
   * @returns A promise that resolves on successful deletion.
   */
  public deleteCycle(key: string) {
    return this.dbService.delete(`${this.cyclePath}/${key}`);
  }

  /**
   * Updates a general budget without showing a loading indicator.
   * @param budget The updated budget object.
   * @param key The unique key of the budget to update.
   * @returns A promise that resolves on successful update.
   */
  public updateNoTimeLimitBudget(budget: Budget, key: string) {
    return this.dbService.updateListValue(this.generalPath, key, budget, false);
  }

  /**
   * Updates a monthly budget without showing a loading indicator.
   * @param budget The updated monthly budget object.
   * @param key The unique key of the budget to update.
   * @returns A promise that resolves on successful update.
   */
  public updateMonthBudget(budget: Budget, key: string) {
    return this.dbService.updateListValue(this.monthPath, key, budget, false);
  }

  /**
   * Updates a budget cycle.
   * @param cycle The updated cycle object.
   * @param key The unique key of the cycle to update.
   * @returns A promise that resolves on successful update.
   */
  public updateCycle(cycle: Cycle, key: string) {
    return this.dbService.updateListValue(this.cyclePath, key, cycle);
  }

  /**
   * Gets all general budgets.
   * @returns An Observable containing a list of all general budgets.
   */
  public getAllNoTimeLimitBudgets() {
    return this.dbService.readList(this.generalPath);
  }

  /**
   * Gets all monthly budgets.
   * @returns An Observable containing a list of all monthly budgets.
   */
  public getAllMonthlyBudgets() {
    return this.dbService.readList(this.monthPath);
  }

  /**
   * Gets all monthly budgets for a specific month.
   * @param monthString The month in 'YYYY-MM' format to filter by.
   * @returns An Observable containing a filtered list of monthly budgets.
   */
  public getAllMonthBudgetsByMonthString(monthString: string) {
    return this.dbService.readFilteredList(this.monthPath, orderByChild('validityPeriod'), equalTo(monthString));
  }

  /**
   * Gets all budgets associated with a specific cycle.
   * @param cycleKey The key of the cycle to filter by.
   * @returns An Observable containing a filtered list of budgets.
   */
  public getAllBudgetsByCycle(cycleKey: string) {
    return this.dbService.readFilteredList(this.monthPath, orderByChild('cycleKey'), equalTo(cycleKey));
  }

  /**
   * Gets all budget cycles.
   * @returns An Observable containing a list of all cycles.
   */
  public getAllCycles() {
    return this.dbService.readList(this.cyclePath);
  }

  /**
   * Gets a specific budget cycle by its key.
   * @param key The unique key of the cycle.
   * @returns An Observable containing the requested cycle or null.
   */
  public getCycle(key: string) {
    return this.dbService.read(`${this.cyclePath}/${key}`);
  }
}
