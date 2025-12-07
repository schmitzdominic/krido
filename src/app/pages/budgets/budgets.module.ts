import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { BudgetsComponent } from './budgets.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { CycleListComponent } from './cycle-list/cycle-list.component';
import { AddOrEditBudgetContentComponent } from './budget-list/add-or-edit-budget-content/add-or-edit-budget-content.component';
import { ViewBudgetContentComponent } from './budget-list/view-budget-content/view-budget-content.component';
import { AddOrEditCycleContentComponent } from './cycle-list/add-or-edit-cycle-content/add-or-edit-cycle-content.component';
import { BudgetArchiveListComponent } from './budget-archive-list/budget-archive-list.component';
import { BudgetListEntryComponent } from '../../components/budget-list-entry/budget-list-entry.component';

@NgModule({
  declarations: [
    BudgetsComponent,
    BudgetListComponent,
    CycleListComponent,
    AddOrEditBudgetContentComponent,
    ViewBudgetContentComponent,
    AddOrEditCycleContentComponent,
    BudgetArchiveListComponent,
    BudgetListEntryComponent,
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
    BudgetsComponent,
    BudgetListComponent,
    CycleListComponent,
    AddOrEditBudgetContentComponent,
    ViewBudgetContentComponent,
    AddOrEditCycleContentComponent,
    BudgetArchiveListComponent,
    BudgetListEntryComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BudgetsModule { }
