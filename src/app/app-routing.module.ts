import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./services/auth/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home-routing.module').then(m => m.HomeRoutingModule), canActivate: [AuthGuard] },
  { path: 'invoice', loadChildren: () => import('./pages/invoice/invoice.module').then(m => m.InvoiceModule), canActivate: [AuthGuard] },
  { path: 'regularly', loadChildren: () => import('./pages/regularly/regularly.module').then(m => m.RegularlyModule), canActivate: [AuthGuard] },
  { path: 'accounts', loadChildren: () => import('./pages/accounts/accounts.module').then(m => m.AccountsModule), canActivate: [AuthGuard] },
  { path: 'budgets', loadChildren: () => import('./pages/budgets/budgets-routing.module').then(m => m.BudgetsRoutingModule), canActivate: [AuthGuard] },
  { path: 'history', loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryModule), canActivate: [AuthGuard] },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
