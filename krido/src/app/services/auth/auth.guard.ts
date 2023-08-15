import { Injectable } from '@angular/core';
import {
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from "../user/user.service";
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(public userService: UserService, public router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if (!this.userService.isLoggedIn) {
      this.router.navigate(['login']);
    }
    return true;
  }
}
