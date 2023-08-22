import { Injectable } from '@angular/core';
import {Budget} from "../../entities/budget.model";
import {DbService} from "../db.service";
import {Cycle} from "../../entities/cycle.model";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private rootPath: string =  `homes/${this.dbService.home}/budgets`;

  constructor(private dbService: DbService) { }

  addBudget(budget: Budget) {
    return this.dbService.createListValue(`${this.rootPath}/general`, budget);
  }

  addCycle(cycle: Cycle) {
    return this.dbService.createListValue(`${this.rootPath}/cycle`, cycle);
  }

  updateBudget(budget: Budget, key: string) {
    return this.dbService.updateListValue(`${this.rootPath}/general`, key, budget);
  }

  addMonthBudget(budget: Budget) {
    return this.dbService.createListValue(`${this.rootPath}/month`, budget);
  }

  getAllNoTimeLimitBudgets() {
    return this.dbService.readList(`${this.rootPath}/general`);
  }
}
