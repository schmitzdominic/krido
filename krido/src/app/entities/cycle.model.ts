import {CycleType} from "../enums/cycle-type.enum";

export interface Cycle {
  key?: string;
  searchName: string;
  name: string;
  limit?: number;
  isInitialValue: boolean;
  isTransfer: boolean;
  isCreateThisCycle: boolean;
  cycleType: CycleType;
}
