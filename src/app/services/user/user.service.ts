import {Injectable, inject} from '@angular/core';
import {DbService} from "../db.service";
import {User} from "../../../shared/interfaces/user.model";
import {Router} from "@angular/router";
import {Account} from "../../../shared/interfaces/account.model";
import {Auth, signOut} from "@angular/fire/auth";
import {equalTo, orderByChild, startAt} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbService = inject(DbService);
  private router = inject(Router);
  private auth: Auth = inject(Auth);

  constructor() { }

  createOrUpdateUser(user: User) {
    return this.dbService.update(`users/${user.uid}`, user);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  get user(): User {
    return JSON.parse(localStorage.getItem('user')!) as User;
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
        firebaseUser: firebaseUser,
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

