import { Component, inject } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../shared/interfaces/user.model";
import {UserService} from "../../services/user/user.service";
import {ToastService} from "../../services/toast/toast.service";
import {Auth, getAuth, signInWithEmailAndPassword} from "firebase/auth";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private auth: Auth = getAuth();
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  isLoading = false;


  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor() {
  }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup(): void {
    this.loginFormGroup = this.formBuilder.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.required]
      }
    );
  }

  onSubmit() {
    if (this.loginFormGroup.valid) {
      this.signIn(
        this.loginFormGroup.value.email,
        this.loginFormGroup.value.password);
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      this.isLoading = true;
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.isLoading = false;
      await this.setUserData(result.user);
    } catch (error: any) {
      if (error && error.code) {
        switch (error.code) {
          case 'auth/wrong-password':
            this.toastService.showDanger('Falsches Passwort');
            break;
          case 'auth/user-not-found':
            this.toastService.showDanger('E-Mail nicht registriert');
            break;
          default:
            this.toastService.showDanger(error.message);
            break;
        }
      } else {
        this.toastService.showDanger('Ein unbekannter Fehler ist aufgetreten.');
      }
      this.isLoading = false;
    }
  }

  setUserData(user: any) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
    return this.userService.createOrUpdateUser(userData);
  }

}
