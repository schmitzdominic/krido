import { Component } from '@angular/core';
import {UserService} from "./services/user/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'krido';

  showLogin = true;
  showMain = false;

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    if (this.userService.isLoggedIn) {
      this.onLoginStateChanged(true);
    }
  }

  onLoginStateChanged(isLoggedIn: boolean): void {
    this.showLogin = !isLoggedIn;
    if (isLoggedIn) {
      this.showLogin = false;
      this.showMain = true;
      this.router.navigate(['actual-month']);
    }
  }
}
