import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {User} from "../../../shared/interfaces/user.model";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import firebase from "firebase/compat";
import {SnapshotAction} from "@angular/fire/compat/database";
import {Account} from "../../../shared/interfaces/account.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private dbService: DbService,
              private router: Router,
              private angularFireAuth: AngularFireAuth) { }

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
    return this.dbService.readFilteredList(`users`, ref => ref.orderByChild('home').startAt(this.dbService.home));
  }

  get getHomePin() {
    return this.dbService.read(`homes/${this.dbService.home}/pin`);
  }

  getUserObservable(firebaseUser: firebase.User) {
    return this.dbService.read(`users/${firebaseUser.uid}`);
  }
  setLocalStorageUser(user: SnapshotAction<any>, firebaseUser: firebase.User | null) {
    if (firebaseUser) {
      if (user.payload.val()) {
        const home = user.payload.val().home;
        const mainAccount = user.payload.val().mainAccount;
        const userObject: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          home: home,
          firebaseUser: firebaseUser,
          mainAccount: mainAccount ? mainAccount : undefined
        };
        localStorage.setItem('user', JSON.stringify(userObject));
      }
    }
  }

  async signOut() {
    this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
      window.location.reload();
    });
  }
}
