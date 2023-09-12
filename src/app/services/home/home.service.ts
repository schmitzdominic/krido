import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {Home} from "../../../shared/interfaces/home.model";
import {UserService} from "../user/user.service";
import {User} from "../../../shared/interfaces/user.model";
import {DateService} from "../date/date.service";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  rootPath: string = '/homes'

  constructor(private dbService: DbService,
              private userService: UserService,
              private dateService: DateService) { }

  get getAllHomes() {
    return this.dbService.readList(this.rootPath);
  }

  get generatePin(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  joinHome(home: Home) {
    let user: User = this.userService.user;
    user.home = home.searchName;
    delete user['firebaseUser'];
    return this.userService.createOrUpdateUser(user);
  }
  createHome(home: Home) {
    return this.dbService.update(`${this.rootPath}/${home.searchName}`, home);
  }

  getActualMonthString() {
    return this.dbService.read(`${this.rootPath}/${this.userService.home}/actualMonthString`)
  }

  setActualMonthString() {
    return this.dbService.update(`${this.rootPath}/${this.userService.home}`, {'actualMonthString': this.dateService.getActualMonthString()}, false);
  }
}
