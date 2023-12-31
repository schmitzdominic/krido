import {User} from "./user.model";
import {AccountType} from "../enums/account-type.enum";

export interface Account {
  key?: string;
  searchName: string;
  name: string;
  owners: User[];
  accountType: AccountType;
  value?: number;
  creditDay?: number;
  creditLastDay?: boolean;
  referenceAccount?: Account;
  updatedDate?: number;
  valueLeft?: number;
}
