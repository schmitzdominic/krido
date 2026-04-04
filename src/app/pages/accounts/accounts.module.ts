import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CurrencyMaskModule } from 'ng2-currency-mask';

import { AccountsComponent } from './accounts.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AddOrEditAccountContentComponent } from './account-list/add-or-edit-account-content/add-or-edit-account-content.component';
import { ViewAccountContentComponent } from './account-list/view-account-content/view-account-content.component';
import { HomeModule } from '../home/home.module';

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
    CurrencyMaskModule,
    HomeModule,
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
