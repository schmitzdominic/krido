import { Injectable, inject } from '@angular/core';
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
  userService = inject(UserService);
  router = inject(Router);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  canActivate(): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if (!this.userService.isLoggedIn) {
      this.router.navigate(['login']);
    }
    return true;
  }
}
