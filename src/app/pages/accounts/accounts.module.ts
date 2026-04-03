import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { AccountsComponent } from './accounts.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AddOrEditAccountContentComponent } from './account-list/add-or-edit-account-content/add-or-edit-account-content.component';
import { ViewAccountContentComponent } from './account-list/view-account-content/view-account-content.component';

@NgModule({
  declarations: [
    AccountsComponent,
    AccountListComponent,
    AddOrEditAccountContentComponent,
    ViewAccountContentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: AccountsComponent }]),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MatIconModule,
    MatButtonModule,
    CurrencyMaskModule,
  ],
  exports: [
    AccountsComponent,
    AccountListComponent,
    AddOrEditAccountContentComponent,
    ViewAccountContentComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AccountsModule { }
