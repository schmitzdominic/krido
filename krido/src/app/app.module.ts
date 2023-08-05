import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ActualMonthComponent } from './components/actual-month/actual-month.component';
import { MainMenuComponent } from './general/main-menu/main-menu.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { ExpendituresComponent } from './components/expenditures/expenditures.component';
import { RegularlyComponent } from './components/regularly/regularly.component';

@NgModule({
  declarations: [
    AppComponent,
    ActualMonthComponent,
    MainMenuComponent,
    AccountsComponent,
    BudgetsComponent,
    ExpendituresComponent,
    RegularlyComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
