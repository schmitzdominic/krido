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

@NgModule({
  declarations: [
    AppComponent,
    ActualMonthComponent,
    MainMenuComponent,
    AccountsComponent,
    BudgetsComponent,
    ExpendituresComponent,
    RegularlyComponent,
    LoginComponent,
    HomeSetupComponent,
    ToastsContainerComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgbModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [
    ScreenTrackingService,UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
