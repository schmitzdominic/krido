import { Injectable } from '@angular/core';
import {Budget} from "../../entities/budget.model";
import {DbService} from "../db.service";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private rootPath: string =  `homes/${this.dbService.home}/budgets`;

  constructor(private dbService: DbService) { }

  addBudget(budget: Budget) {
    return this.dbService.create(`${this.rootPath}/general`, budget);
  }

  addMonthBudget(budget: Budget, year: number, month: number) {
    return this.dbService.create(`${this.rootPath}/month/${year}/${month}`, budget);
  }
}
