import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { HistoryComponent } from './history.component';
import { HistoryListComponent } from './history-list/history-list.component';
import { HomeModule } from "../home/home.module";

@NgModule({
  declarations: [
    HistoryComponent,
    HistoryListComponent,
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
    HomeModule
],
  exports: [
    HistoryComponent,
    HistoryListComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HistoryModule { }
