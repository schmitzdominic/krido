import { Component, signal, ViewChild, inject, Injector, runInInjectionContext } from '@angular/core';
import {UserService} from "./services/user/user.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Auth, getAuth, onAuthStateChanged} from "firebase/auth";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private auth: Auth = getAuth();
  private modalService = inject(NgbModal);
  private injector = inject(Injector);

  @ViewChild('loadingModal') loadingModal: NgbModalRef | undefined;

  modalRef: NgbModalRef | undefined;

  readonly mainPage: string = 'home';

  readonly showLogin    = signal(true);
  readonly showHomeSetup = signal(false);
  readonly showMain     = signal(false);

  constructor() {
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
    this.showLogin.set(showLogin);
    this.showMain.set(showMain);
    this.showHomeSetup.set(showHomeSetup);
  }

  private checkIfUserLoggedIn() {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        runInInjectionContext(this.injector, () => {
          this.userService.getUserObservable(firebaseUser).subscribe(user => {
            if (!this.userService.isLoggedIn) {
              this.userService.setLocalStorageUser(user, firebaseUser);
              this.onLoginStateChanged(true);
            } else {
              this.userService.setLocalStorageUser(user, firebaseUser);
            }
          });
        });
      } else {
        this.showLoginPage();
        localStorage.setItem('user', 'null');
      }
    });
  }

  private onLoginStateChanged(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      if (this.userService.user.home) {
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
    this.router.navigate([this.mainPage], { replaceUrl: true });
  }

  private showHomeSetupPage(): void {
    this.setPageState(false, false, true);
  }
}
