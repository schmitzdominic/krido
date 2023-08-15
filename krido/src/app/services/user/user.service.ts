import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {User} from "../../entities/user.model";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import firebase from "firebase/compat";
import {SnapshotAction} from "@angular/fire/compat/database";

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

  get getUser(): User {
    return JSON.parse(localStorage.getItem('user')!);
  }

  get getHome(): string | null {
    return localStorage.getItem('home');
  }

  getUserObservable(firebaseUser: firebase.User) {
    return this.dbService.read(`users/${firebaseUser.uid}`);
  }
  async setLocalStorageUser(user: SnapshotAction<any>, firebaseUser: firebase.User | null) {
    if (firebaseUser) {
      if (user.payload.val()) {
        const home = user.payload.val().home;
        const userObject: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          home: home,
          firebaseUser: firebaseUser
        };
        localStorage.setItem('user', JSON.stringify(userObject));
      }
    }
  }

  async signOut() {
    this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }
}
