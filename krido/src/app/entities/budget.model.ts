import {Entry} from "./entry.model";

export interface Budget {
  searchName: string;
  name: string;
  limit?: number;
  usedLimit?: number;
  entries?: Entry[];
}
