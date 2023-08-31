import firebase from "firebase/compat";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  home?: string;
  firebaseUser?: firebase.User;
}
