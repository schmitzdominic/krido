import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../../entities/user.model";
import {UserService} from "../../services/user/user.service";
import {ToastService} from "../../services/toast/toast.service";
import {LoadingService} from "../../services/loading/loading.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder,
              private angularFireAuth: AngularFireAuth,
              private userService: UserService,
              private toastService: ToastService,
              private loadingService: LoadingService) {
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
      this.loadingService.setLoading = true;
      const result = await this.angularFireAuth
        .signInWithEmailAndPassword(email, password);
      this.loadingService.setLoading = false;
      await this.setUserData(result.user);
    } catch (error) {
      if (error) {
        const errorMessage: string = error.toString();
        if (errorMessage.includes('auth/wrong-password')) {
          this.toastService.showDanger('Falsches Passwort');
        } else if (errorMessage.includes('auth/user-not-found')) {
          this.toastService.showDanger('E-Mail nicht registriert');
        } else {
          this.toastService.showDanger(error.toString());
        }
        this.loadingService.setLoading = false;
      }
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
