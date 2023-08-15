import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ActualMonthComponent} from "./components/actual-month/actual-month.component";
import {AccountsComponent} from "./components/accounts/accounts.component";
import {BudgetsComponent} from "./components/budgets/budgets.component";
import {ExpendituresComponent} from "./components/expenditures/expenditures.component";
import {RegularlyComponent} from "./components/regularly/regularly.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./services/auth/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'actual-month', component: ActualMonthComponent, canActivate: [AuthGuard] },
  { path: 'regularly', component: RegularlyComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'budgets', component: BudgetsComponent, canActivate: [AuthGuard] },
  { path: 'expenditures', component: ExpendituresComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
