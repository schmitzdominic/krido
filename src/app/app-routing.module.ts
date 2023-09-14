import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {AccountsComponent} from "./pages/accounts/accounts.component";
import {BudgetsComponent} from "./pages/budgets/budgets.component";
import {HistoryComponent} from "./pages/history/history.component";
import {RegularlyComponent} from "./pages/regularly/regularly.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./services/auth/auth.guard";
import {SettingsComponent} from "./pages/settings/settings.component";
import {InvoiceComponent} from "./pages/invoice/invoice.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuard] },
  { path: 'regularly', component: RegularlyComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'budgets', component: BudgetsComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
