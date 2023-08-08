import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ActualMonthComponent} from "./components/actual-month/actual-month.component";
import {AccountsComponent} from "./components/accounts/accounts.component";
import {BudgetsComponent} from "./components/budgets/budgets.component";
import {ExpendituresComponent} from "./components/expenditures/expenditures.component";
import {RegularlyComponent} from "./components/regularly/regularly.component";
import {LoginComponent} from "./components/login/login.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'actual-month', component: ActualMonthComponent },
  { path: 'regularly', component: RegularlyComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'expenditures', component: ExpendituresComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
