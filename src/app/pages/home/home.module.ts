import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CurrencyMaskModule } from 'ng2-currency-mask';

import { HomeComponent } from './home.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { AddOrEditEntryComponent } from './entry-list/add-or-edit-entry/add-or-edit-entry.component';
import { InfoAreaComponent } from './info-area/info-area.component';
import { UpdateAccountValueComponent } from './info-area/update-account-value/update-account-value.component';
import { InfoListEntryComponent } from '../../components/info-list-entry/info-list-entry.component';
import { BudgetsModule } from "../budgets/budgets.module";

@NgModule({
  declarations: [
    HomeComponent,
    EntryListComponent,
    AddOrEditEntryComponent,
    InfoAreaComponent,
    UpdateAccountValueComponent,
    InfoListEntryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    CurrencyMaskModule,
    BudgetsModule
],
  exports: [
    HomeComponent,
    EntryListComponent,
    AddOrEditEntryComponent,
    InfoAreaComponent,
    UpdateAccountValueComponent,
    InfoListEntryComponent,
    BudgetsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeModule { }
