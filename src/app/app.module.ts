import {NgModule, isDevMode} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbDateParserFormatter, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from './pages/home/home.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { BudgetsComponent } from './pages/budgets/budgets.component';
import { HistoryComponent } from './pages/history/history.component';
import { RegularlyComponent } from './pages/regularly/regularly.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import {AngularFireModule} from "@angular/fire/compat";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeSetupComponent } from './components/home-setup/home-setup.component';
import { ToastsContainerComponent } from './components/toasts-container/toasts-container.component';
import { BudgetListComponent } from './pages/budgets/budget-list/budget-list.component';
import { CycleListComponent } from './pages/budgets/cycle-list/cycle-list.component';
import { AddOrEditBudgetContentComponent } from './pages/budgets/budget-list/add-or-edit-budget-content/add-or-edit-budget-content.component';
import {CurrencyMaskModule} from "ng2-currency-mask";
import { ViewBudgetContentComponent } from './pages/budgets/budget-list/view-budget-content/view-budget-content.component';
import { AddOrEditCycleContentComponent } from './pages/budgets/cycle-list/add-or-edit-cycle-content/add-or-edit-cycle-content.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BudgetArchiveListComponent } from './pages/budgets/budget-archive-list/budget-archive-list.component';
import { BudgetListEntryComponent } from './components/budget-list-entry/budget-list-entry.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SettingsUserComponent } from './pages/settings/settings-user/settings-user.component';
import { SettingsHomeComponent } from './pages/settings/settings-home/settings-home.component';
import { AccountListComponent } from './pages/accounts/account-list/account-list.component';
import { AddOrEditAccountContentComponent } from './pages/accounts/account-list/add-or-edit-account-content/add-or-edit-account-content.component';
import { ViewAccountContentComponent } from './pages/accounts/account-list/view-account-content/view-account-content.component';
import { EntryListComponent } from './pages/home/entry-list/entry-list.component';
import { AddOrEditEntryComponent } from './pages/home/entry-list/add-or-edit-entry/add-or-edit-entry.component';
import {NgbDateCustomParserFormatter} from "../shared/formatter/ngb-date-custom-parser-formatter";
import { EntryListEntryComponent } from './components/entry-list-entry/entry-list-entry.component';
import { RegularlyListComponent } from './pages/regularly/regularly-list/regularly-list.component';
import { BirthdayListComponent } from './pages/regularly/birthday-list/birthday-list.component';
import { RegularlyListEntryComponent } from './components/regularly-list-entry/regularly-list-entry.component';
import { AddOrEditRegularlyComponent } from './pages/regularly/add-or-edit-regularly/add-or-edit-regularly.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainMenuComponent,
    AccountsComponent,
    BudgetsComponent,
    HistoryComponent,
    RegularlyComponent,
    LoginComponent,
    HomeSetupComponent,
    ToastsContainerComponent,
    BudgetListComponent,
    CycleListComponent,
    AddOrEditBudgetContentComponent,
    ViewBudgetContentComponent,
    AddOrEditCycleContentComponent,
    BudgetArchiveListComponent,
    BudgetListEntryComponent,
    SettingsComponent,
    SettingsUserComponent,
    SettingsHomeComponent,
    AccountListComponent,
    AddOrEditAccountContentComponent,
    ViewAccountContentComponent,
    EntryListComponent,
    AddOrEditEntryComponent,
    EntryListEntryComponent,
    RegularlyListComponent,
    BirthdayListComponent,
    RegularlyListEntryComponent,
    AddOrEditRegularlyComponent,
    InvoiceComponent,
  ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebase),
        NgbModule,
        AppRoutingModule,
        CurrencyMaskModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        FormsModule
    ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
