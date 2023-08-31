import {EntryType} from "../enums/entry-type.enum";

export interface Entry {
  searchName: string;
  name: string;
  type: EntryType;
  value: number;
}
