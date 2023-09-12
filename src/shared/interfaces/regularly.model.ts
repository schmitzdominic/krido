import {Account} from "./account.model";
import {RegularlyType} from "../enums/regularly-type.enum";
import {RegularlyCycleType} from "../enums/regularly-cycle-type.enum";
import {EntryType} from "../enums/entry-type.enum";

export interface Regularly {
  key?: string,
  searchName: string;
  name: string;
  entryType: EntryType;
  type?: RegularlyType;
  cycle: RegularlyCycleType;
  monthDay: number;
  value: number;
  account: Account;
  date?: number;
  isEndOfMonth?: boolean;
}
