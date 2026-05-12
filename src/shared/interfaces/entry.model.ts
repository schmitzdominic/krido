import {EntryType} from "../enums/entry-type.enum";
import {Account} from "./account.model";

export interface Entry {
  key?: string,
  searchName: string;
  name: string;
  type: EntryType;
  value: number;
  budgetKey?: string;
  account: Account;
  date: number;
  monthString: string;
  /** Identifies this entry as an invoice entry. Format: '{billedMonthString}_{beneficiaryAccountId}' */
  abrechnung?: string;
}
