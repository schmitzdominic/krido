import { Injectable, inject } from '@angular/core';
import {
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from "../user/user.service";

/**
 * A guard to protect routes that require user authentication.
 * It checks if a user is logged in before allowing access to a route.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  userService = inject(UserService);
  router = inject(Router);
  
  /**
   * Determines if a route can be activated.
   * If the user is not logged in, it cancels the current navigation and redirects to the '/login' page.
   * @returns {boolean | UrlTree} Returns `true` if the user is logged in, or a `UrlTree` to redirect to the login page.
   */
  canActivate(): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if (this.userService.isLoggedIn) {
      return true;
    }

    // Redirect to the login page if the user is not logged in.
    return this.router.createUrlTree(['/login']);
  }
}
