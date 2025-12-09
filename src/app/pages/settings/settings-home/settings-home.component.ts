import { Component, inject, Injector, runInInjectionContext } from '@angular/core';
import {UserService} from "../../../services/user/user.service";

@Component({
    selector: 'app-settings-home',
    templateUrl: './settings-home.component.html',
    styleUrls: ['./settings-home.component.scss'],
    standalone: false
})
export class SettingsHomeComponent {
  userService = inject(UserService);
  private injector = inject(Injector);


  home: string = '';
  pin: string = '';

  ngOnInit() {
    this.home = this.userService.home;
    this.setPin();
  }

  setPin() {
    this.userService.getHomePin.subscribe(pinReference => runInInjectionContext(this.injector, () => {
      // The service now returns the value directly.
      // We convert it to a string and handle null/undefined cases.
      this.pin = pinReference ? String(pinReference) : '';
    }));
  }

}
