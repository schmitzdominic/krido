import {Entry} from "./entry.model";

export interface Budget {
  key?: string;
  searchName: string;
  name: string;
  limit?: number;
  usedLimit?: number;
  validityPeriod?: string;
  entries?: Entry[];
  isArchived: boolean;
}
