import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { InvoiceComponent } from './invoice.component';
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceSettingsComponent,
    InvoiceListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: InvoiceComponent }]),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MatIconModule,
    MatButtonModule,
    CurrencyMaskModule,
  ],
  exports: [
    InvoiceComponent,
    InvoiceSettingsComponent,
    InvoiceListComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class InvoiceModule { }
