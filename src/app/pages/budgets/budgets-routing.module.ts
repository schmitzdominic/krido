import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BudgetsModule } from './budgets.module';
import { BudgetsComponent } from './budgets.component';

@NgModule({
  imports: [
    BudgetsModule,
    RouterModule.forChild([{ path: '', component: BudgetsComponent }]),
  ],
  exports: [RouterModule],
})
export class BudgetsRoutingModule {}
