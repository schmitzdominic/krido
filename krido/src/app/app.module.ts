import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from './components/home/home.component';
import { MainMenuComponent } from './general/main-menu/main-menu.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { HistoryComponent } from './components/history/history.component';
import { RegularlyComponent } from './components/regularly/regularly.component';
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
import {ReactiveFormsModule} from "@angular/forms";
import { HomeSetupComponent } from './components/home-setup/home-setup.component';
import { ToastsContainerComponent } from './general/toasts-container/toasts-container.component';
import { BudgetListComponent } from './components/budgets/budget-list/budget-list.component';
import { CycleListComponent } from './components/budgets/cycle-list/cycle-list.component';
import { AddOrEditBudgetContentComponent } from './components/budgets/budget-list/add-or-edit-budget-content/add-or-edit-budget-content.component';
import {CurrencyMaskModule} from "ng2-currency-mask";
import { ShowBudgetContentComponent } from './components/budgets/budget-list/edit-budget-content/show-budget-content.component';
import { AddOrEditCycleContentComponent } from './components/budgets/cycle-list/add-or-edit-cycle-content/add-or-edit-cycle-content.component';
import { EditCycleContentComponent } from './components/budgets/cycle-list/edit-cycle-content/edit-cycle-content.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BudgetArchiveListComponent } from './components/budgets/budget-archive-list/budget-archive-list.component';
import { BudgetListEntryComponent } from './components/budgets/budget-list-entry/budget-list-entry.component';

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
    ShowBudgetContentComponent,
    AddOrEditCycleContentComponent,
    EditCycleContentComponent,
    BudgetArchiveListComponent,
    BudgetListEntryComponent,
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
    })
  ],
  providers: [
    ScreenTrackingService,UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
