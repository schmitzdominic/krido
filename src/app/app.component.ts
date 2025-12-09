import { Component, ViewChild, inject } from '@angular/core';
import {UserService} from "./services/user/user.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {LoadingService} from "./services/loading/loading.service";
import {Auth, onAuthStateChanged} from "@angular/fire/auth";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private auth: Auth = inject(Auth);
  private modalService = inject(NgbModal);
  private loadingService = inject(LoadingService);


  @ViewChild('loadingModal') loadingModal: NgbModalRef | undefined;

  modalRef: NgbModalRef | undefined;

  title:    string = 'krido';
  mainPage: string = 'home';

  showLogin:      boolean = true;
  showHomeSetup:  boolean = false;
  showMain:       boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.subscribeLoadingService();
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

  private subscribeLoadingService() {
    this.loadingService.isLoading.subscribe(isLoading => {
      if (isLoading) {
        this.openLoading();
      } else {
        this.closeLoading();
      }
    });
  }

  private checkIfUserLoggedIn() {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        this.userService.getUserObservable(firebaseUser).subscribe(user => {
          if (!this.userService.isLoggedIn) {
            this.userService.setLocalStorageUser(user, firebaseUser);
            this.onLoginStateChanged(true);
          } else {
            this.userService.setLocalStorageUser(user, firebaseUser);
          }
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
    this.router.navigate([this.mainPage]);
  }

  private showHomeSetupPage(): void {
    this.setPageState(false, false, true);
  }

  openLoading() {
    this.modalRef = this.modalService.open(
      this.loadingModal,
      {
        centered: true,
        size: 'md',
        keyboard: false,
        backdrop: 'static'
      });
  }

  closeLoading() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
