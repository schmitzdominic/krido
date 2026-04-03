import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {UserService} from "../../../services/user/user.service";

@Component({
    selector: 'app-settings-home',
    templateUrl: './settings-home.component.html',
    styleUrls: ['./settings-home.component.scss'],
    standalone: false
})
export class SettingsHomeComponent {
  userService = inject(UserService);
  private destroyRef = inject(DestroyRef);


  home: string = '';
  pin: string = '';

  ngOnInit() {
    this.home = this.userService.home;
    this.setPin();
  }

  setPin() {
    this.userService.getHomePin.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(pinReference => {
      this.pin = pinReference ? String(pinReference) : '';
    });
  }

}
