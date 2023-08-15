import { Injectable } from '@angular/core';
import {DbService} from "../db.service";
import {Home} from "../../entities/home.model";
import {UserService} from "../user/user.service";
import {User} from "../../entities/user.model";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  rootPath = '/homes'

  constructor(private dbService: DbService,
              private userService: UserService) { }

  get getAllHomes() {
    return this.dbService.readList(this.rootPath);
  }

  get generatePin(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  convertToSearchName(name: string) {
    return name.replaceAll(' ', '').toLowerCase();
  }

  joinHome(home: Home) {
    let user: User = this.userService.getUser;
    user.home = home.searchName;
    delete user['firebaseUser'];
    return this.userService.createOrUpdateUser(user);
  }
  createHome(home: Home) {
    return this.dbService.update(`${this.rootPath}/${home.searchName}`, home);
  }
}
