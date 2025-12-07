import {Account} from "./account.model";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  home?: string;
  mainAccount?: Account;
  firebaseUser?: any;
}
