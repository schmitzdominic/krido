import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import {UserService} from "../../../services/user/user.service";

@Component({
    selector: 'app-settings-home',
    templateUrl: './settings-home.component.html',
    styleUrls: ['./settings-home.component.scss'],
    standalone: false
})
export class SettingsHomeComponent {
  userService = inject(UserService);

  readonly home: string = this.userService.home;
  readonly pin = toSignal(
    this.userService.getHomePin.pipe(map(p => p ? String(p) : '')),
    { initialValue: '' }
  );
}
