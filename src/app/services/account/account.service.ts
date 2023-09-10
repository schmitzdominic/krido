import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {Account} from "../../../shared/interfaces/account.model";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private rootPath: string =  `homes/${this.dbService.home}/accounts`;

  noAccountValue: Account = {
    key: 'key',
    name: 'Kein Konto angelegt',
    searchName: 'keinKontoAngelegt',
    owners: [this.userService.user],
    accountType: AccountType.giro
  }

  constructor(private dbService: DbService,
              private userService: UserService) { }

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
