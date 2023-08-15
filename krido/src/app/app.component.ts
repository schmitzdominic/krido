import { Component } from '@angular/core';
import {UserService} from "./services/user/user.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'krido';

  showLogin:      boolean = true;
  showHomeSetup:  boolean = false;
  showMain:       boolean = false;

  mainPage = 'actual-month';

  constructor(private userService: UserService,
              private router: Router,
              private angularFireAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.checkIfUserLoggedIn();
    if (this.userService.isLoggedIn) {
      this.onLoginStateChanged(true);
    }
  }

  private setPageState(showLogin: boolean,
                       showMain: boolean,
                       showHomeSetup: boolean): void {
    this.showLogin = showLogin;
    this.showMain = showMain;
    this.showHomeSetup = showHomeSetup;
  }

  private checkIfUserLoggedIn() {
    this.angularFireAuth.authState.subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.userService.getUserObservable(firebaseUser).subscribe(user => {
          this.userService.setUser(user, firebaseUser);
          this.onLoginStateChanged(true);
        });
      } else {
        this.showLoginPage();
        localStorage.setItem('user', 'null');
      }
    });
  }

  private onLoginStateChanged(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      if (this.userService.getUser.home) {
        this.showMainPage();
      } else {
        this.showHomeSetupPage();
      }
    } else {
      this.showLoginPage();
    }
  }

  private showLoginPage(): void {
    this.setPageState(true, false, false);
  }

  private showMainPage(): void {
    this.setPageState(false, true, false);
    this.router.navigate([this.mainPage]);
  }

  private showHomeSetupPage(): void {
    this.setPageState(false, false, true);
  }
}
