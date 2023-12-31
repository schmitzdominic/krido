import { Component } from '@angular/core';
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.scss']
})
export class SettingsHomeComponent {

  home: string = '';
  pin: string = '';

  constructor(public userService: UserService) {
  }

  ngOnInit() {
    this.home = this.userService.home;
    this.setPin();
  }

  setPin() {
    this.userService.getHomePin.subscribe(pinReference => {
      this.pin = pinReference.payload.val() as string;
    });
  }

}
