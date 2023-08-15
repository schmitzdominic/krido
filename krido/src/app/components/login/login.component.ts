import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../../entities/user.model";
import {UserService} from "../../services/user/user.service";

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
              private userService: UserService) {
  }

  ngOnInit(): void {
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
      const result = await this.angularFireAuth
        .signInWithEmailAndPassword(email, password);
      await this.setUserData(result.user);
    } catch (error) {
      //@ts-ignore
      window.alert(error.message);
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
