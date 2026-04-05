import {Injectable, inject} from '@angular/core';
import {DbService} from "../db.service";
import {User} from "../../../shared/interfaces/user.model";
import {Router} from "@angular/router";
import {Account} from "../../../shared/interfaces/account.model";
import {Auth, getAuth, signOut} from "firebase/auth";
import {equalTo, orderByChild, startAt} from "firebase/database";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbService = inject(DbService);
  private router = inject(Router);
  private auth: Auth = getAuth();

  constructor() { }

  createOrUpdateUser(user: User) {
    return this.dbService.update(`users/${user.uid}`, user);
  }

  get isLoggedIn(): boolean {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return user !== null;
    } catch {
      return false;
    }
  }

  get user(): User {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null') as User;
    } catch {
      return { uid: '', email: null, displayName: null };
    }
  }

  get home(): string {
    const home = this.user.home;
    return home ? home : '';
  }

  get mainAccount() {
    return this.user.mainAccount ? this.user.mainAccount : undefined;
  }

  updateMainAccount(account: Account) {
    return this.dbService.update(`users/${this.user.uid}/mainAccount`, account)
  }

  getAllUsers() {
    return this.dbService.readList('users');
  }

  getAllUsersFromActualHome() {
    // Note: The 'startAt' might need to be combined with 'endAt' for exact match,
    // or use 'equalTo'. Assuming 'startAt' is for prefix search which is unlikely for a home key.
    // Let's change to equalTo for a more correct query.
    return this.dbService.readFilteredList(`users`, orderByChild('home'), equalTo(this.dbService.home));
  }

  get getHomePin() {
    return this.dbService.read(`homes/${this.dbService.home}/pin`);
  }

  getUserObservable(firebaseUser: any) {
    return this.dbService.read(`users/${firebaseUser.uid}`);
  }

  setLocalStorageUser(user: any, firebaseUser: any) {
    if (firebaseUser && user) {
      const userObject: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        home: user.home,
        mainAccount: user.mainAccount ? user.mainAccount : undefined
      };
      localStorage.setItem('user', JSON.stringify(userObject));
    }
  }

  async signOut() {
    await signOut(this.auth);
    localStorage.removeItem('user');
    await this.router.navigate(['/login']);
    window.location.reload();
  }
}

