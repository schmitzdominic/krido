import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {User} from "../../entities/user.model";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private dbService: DbService,
              private angularFireAuth: AngularFireAuth) { }

  createNewUser(user: User) {
    return this.dbService.create(`users/${user.uid}`, user);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  async signOut() {
    this.angularFireAuth.signOut().then(data => {
      localStorage.removeItem('user');
      console.log('logged out');
      // Navigate back to login
    });
  }
}
