import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CurrencyMaskModule } from 'ng2-currency-mask';

import { BudgetsComponent } from './budgets.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { CycleListComponent } from './cycle-list/cycle-list.component';
import { AddOrEditBudgetContentComponent } from './budget-list/add-or-edit-budget-content/add-or-edit-budget-content.component';
import { ViewBudgetContentComponent } from './budget-list/view-budget-content/view-budget-content.component';
import { AddOrEditCycleContentComponent } from './cycle-list/add-or-edit-cycle-content/add-or-edit-cycle-content.component';
import { BudgetArchiveListComponent } from './budget-archive-list/budget-archive-list.component';
import { BudgetListEntryComponent } from '../../components/budget-list-entry/budget-list-entry.component';
import { EntryListEntryComponent } from '../../components/entry-list-entry/entry-list-entry.component';

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
    EntryListEntryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
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
    EntryListEntryComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BudgetsModule { }
