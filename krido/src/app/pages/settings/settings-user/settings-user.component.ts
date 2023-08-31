import { Component } from '@angular/core';
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-settings-user',
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.scss']
})
export class SettingsUserComponent {

  constructor(private userService: UserService) {
  }

  onButtonLogout() {
    this.userService.signOut();
  }

}
