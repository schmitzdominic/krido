import {Entry} from "./entry.model";

export interface Budget {
  id?: string;
  cycleKey?: string;
  searchName: string;
  name: string;
  limit?: number;
  usedLimit?: number;
  validityPeriod?: string;
  entries?: Entry[];
  isArchived: boolean;
}
