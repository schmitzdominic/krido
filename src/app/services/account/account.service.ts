import { Injectable, inject } from '@angular/core';
import {DbService} from "../db.service";
import {Account} from "../../../shared/interfaces/account.model";
import {AccountType} from "../../../shared/enums/account-type.enum";
import {UserService} from "../user/user.service";
import {equalTo, orderByChild} from "firebase/database";

/**
 * Service for managing accounts in the database.
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private dbService = inject(DbService);
  private userService = inject(UserService);

  private get rootPath(): string { return `homes/${this.dbService.home}/accounts`; }

  noAccountValue: Account = {
    id: 'id',
    name: 'Kein Konto angelegt',
    searchName: 'keinKontoAngelegt',
    owners: [this.userService.user],
    accountType: AccountType.giro
  }

  constructor() { }

  /**
   * Adds a new account to the database.
   * @param account The account object to add.
   * @returns A promise that resolves on successful creation.
   */
  public addAccount(account: Account) {
    return this.dbService.createListValue(this.rootPath, account);
  }

  /**
   * Gets all accounts from the database.
   * @returns An Observable containing a list of all accounts.
   */
  public getAllAccounts() {
    return this.dbService.readList(this.rootPath);
  }

  /**
   * Gets all accounts filtered by a specific account type.
   * @param accountType The account type to filter by.
   * @returns An Observable containing a filtered list of accounts.
   */
  public getAllAccountsFilteredByAccountType(accountType: AccountType) {
    return this.dbService.readFilteredList(this.rootPath, orderByChild('accountType'), equalTo(accountType));
  }

  /**
   * Updates an existing account in the database.
   * @param account The updated account object.
   * @param key The unique key of the account to update.
   * @returns A promise that resolves on successful update.
   */
  public updateAccount(account: Account, key: string) {
    return this.dbService.updateListValue(this.rootPath, key, account);
  }

  /**
   * Sets the value and updated date for a specific account.
   * This is used to update the account balance.
   * @param date The timestamp of the update.
   * @param value The new value (account balance).
   * @param key The unique key of the account.
   * @returns A promise that resolves on successful update.
   */
  public setValue(date: number, value: number, key: string) {
    return this.dbService.update(`${this.rootPath}/${key}`,{updatedDate: date, value: value});
  }

  public getAccountById(id: string) {
    return this.dbService.read<Account & { id: string }>(`${this.rootPath}/${id}`);
  }
}