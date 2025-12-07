import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { SettingsComponent } from './settings.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { SettingsHomeComponent } from './settings-home/settings-home.component';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsUserComponent,
    SettingsHomeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MatIconModule,
    MatButtonModule,
    CurrencyMaskModule,
  ],
  exports: [
    SettingsComponent,
    SettingsUserComponent,
    SettingsHomeComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SettingsModule { }
