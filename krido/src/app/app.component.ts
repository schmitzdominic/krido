import {Component, ViewChild} from '@angular/core';
import {UserService} from "./services/user/user.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {LoadingService} from "./services/loading/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('loadingModal') loadingModal: NgbModalRef | undefined;

  modalRef: NgbModalRef | undefined;

  title = 'krido';

  showLogin:      boolean = true;
  showHomeSetup:  boolean = false;
  showMain:       boolean = false;

  mainPage = 'actual-month';

  constructor(private userService: UserService,
              private router: Router,
              private angularFireAuth: AngularFireAuth,
              private modalService: NgbModal,
              private loadingService: LoadingService) {
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
    this.angularFireAuth.authState.subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.userService.getUserObservable(firebaseUser).subscribe(user => {
          this.userService.setLocalStorageUser(user, firebaseUser);
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

  openLoading() {
    this.modalRef = this.modalService.open(
      this.loadingModal,
      {
        centered: true,
        size: 'sm',
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
