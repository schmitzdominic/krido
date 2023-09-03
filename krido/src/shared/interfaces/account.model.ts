import {User} from "./user.model";
import {AccountType} from "../enums/account-type.enum";

export interface Account {
  key?: string;
  searchName: string;
  name: string;
  owners: User[];
  accountType: AccountType;
}
