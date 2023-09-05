import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {Account} from "../../../shared/interfaces/account.model";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private rootPath: string =  `homes/${this.dbService.home}/accounts`;

  constructor(private dbService: DbService) { }

  addAccount(account: Account) {
    return this.dbService.createListValue(`${this.rootPath}`, account);
  }

  getAllAccounts() {
    return this.dbService.readList(`${this.rootPath}`);
  }

  updateAccount(account: Account, key: string) {
    return this.dbService.updateListValue(`${this.rootPath}`, key, account);
  }
}
