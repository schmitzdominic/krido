import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ActualMonthComponent} from "./components/actual-month/actual-month.component";
import {AccountsComponent} from "./components/accounts/accounts.component";
import {BudgetsComponent} from "./components/budgets/budgets.component";
import {ExpendituresComponent} from "./components/expenditures/expenditures.component";
import {RegularlyComponent} from "./components/regularly/regularly.component";

const routes: Routes = [
  { path: '', redirectTo: '/actual-month', pathMatch: 'full' },
  { path: 'actual-month', component: ActualMonthComponent },
  { path: 'regularly', component: RegularlyComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'expenditures', component: ExpendituresComponent },
  { path: '**', component: ActualMonthComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
