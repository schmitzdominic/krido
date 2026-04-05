import { ChangeDetectionStrategy, Component } from '@angular/core';
import {Regularly} from "../../../../shared/interfaces/regularly.model";

@Component({
    selector: 'app-birthday-list',
    templateUrl: './birthday-list.component.html',
    styleUrls: ['./birthday-list.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BirthdayListComponent {

  regularities: Regularly[] = [];

  constructor() {
  }

  ngOnInit() {

  }
}
