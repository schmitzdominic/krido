import { Injectable, inject } from '@angular/core';
import {DbService} from "../db.service";
import {Account} from "../../../shared/interfaces/account.model";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {UserService} from "../user/user.service";
import {equalTo, orderByChild} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private dbService = inject(DbService);
  private userService = inject(UserService);

  private rootPath: string =  `homes/${this.dbService.home}/accounts`;

  noAccountValue: Account = {
    id: 'id',
    name: 'Kein Konto angelegt',
    searchName: 'keinKontoAngelegt',
    owners: [this.userService.user],
    accountType: AccountType.giro
  }

  constructor() { }

  addAccount(account: Account) {
    return this.dbService.createListValue(`${this.rootPath}`, account);
  }

  getAllAccounts() {
    return this.dbService.readList(`${this.rootPath}`);
  }

  getAllAccountsFilteredByAccountType(accountType: AccountType) {
    return this.dbService.readFilteredList(`${this.rootPath}`, orderByChild('accountType'), equalTo(accountType));
  }

  updateAccount(account: Account, key: string) {
    return this.dbService.updateListValue(`${this.rootPath}`, key, account);
  }

  setValue(date: number, value: number, key: string) {
    return this.dbService.update(`${this.rootPath}/${key}`,{updatedDate: date, value: value});
  }
}
