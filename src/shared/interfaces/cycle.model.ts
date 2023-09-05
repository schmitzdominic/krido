import {CycleType} from "../enums/cycle-type.enum";

export interface Cycle {
  key?: string;
  searchName: string;
  name: string;
  limit?: number;
  isTransfer: boolean;
  type: CycleType;
}
