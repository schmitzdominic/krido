import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { RegularlyComponent } from './regularly.component';
import { RegularlyListComponent } from './regularly-list/regularly-list.component';
import { BirthdayListComponent } from './birthday-list/birthday-list.component';
import { AddOrEditRegularlyComponent } from './add-or-edit-regularly/add-or-edit-regularly.component';
import { RegularlyListEntryComponent } from '../../components/regularly-list-entry/regularly-list-entry.component';

@NgModule({
  declarations: [
    RegularlyComponent,
    RegularlyListComponent,
    BirthdayListComponent,
    AddOrEditRegularlyComponent,
    RegularlyListEntryComponent,
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
    RegularlyComponent,
    RegularlyListComponent,
    BirthdayListComponent,
    AddOrEditRegularlyComponent,
    RegularlyListEntryComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class RegularlyModule { }
