import { Injectable } from '@angular/core';
import {Budget} from "../../../shared/interfaces/budget.model";
import {DbService} from "../db.service";
import {Cycle} from "../../../shared/interfaces/cycle.model";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private rootPath: string =  `homes/${this.dbService.home}/budgets`;

  constructor(private dbService: DbService) { }

  addBudget(budget: Budget) {
    return this.dbService.createListValue(`${this.rootPath}/general`, budget);
  }

  addMonthBudget(budget: Budget) {
    return this.dbService.createListValue(`${this.rootPath}/month`, budget);
  }

  addCycle(cycle: Cycle) {
    return this.dbService.createListValue(`${this.rootPath}/cycle`, cycle);
  }

  deleteBudget(key: string) {
    return this.dbService.delete(`${this.rootPath}/general/${key}`);
  }

  deleteMonthBudget(key: string) {
    return this.dbService.delete(`${this.rootPath}/month/${key}`);
  }

  deleteCycle(key: string) {
    return this.dbService.delete(`${this.rootPath}/cycle/${key}`);
  }

  updateNoTimeLimitBudget(budget: Budget, key: string) {
    return this.dbService.updateListValue(`${this.rootPath}/general`, key, budget);
  }

  updateMonthBudget(budget: Budget, key: string) {
    return this.dbService.updateListValue(`${this.rootPath}/month`, key, budget);
  }

  updateCycle(cycle: Cycle, key: string) {
    return this.dbService.updateListValue(`${this.rootPath}/cycle`, key, cycle);
  }

  getAllNoTimeLimitBudgets() {
    return this.dbService.readList(`${this.rootPath}/general`);
  }

  getAllMonthlyBudgets() {
    return this.dbService.readList(`${this.rootPath}/month`);
  }

  getAllCycles() {
    return this.dbService.readList(`${this.rootPath}/cycle`);
  }
}
