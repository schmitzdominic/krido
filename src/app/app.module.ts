import {NgModule, isDevMode, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbDateParserFormatter, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { MainMenuComponent } from './components/main-menu/main-menu.component';
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
import { ServiceWorkerModule } from '@angular/service-worker';
import {NgbDateCustomParserFormatter} from "../shared/formatter/ngb-date-custom-parser-formatter";

// Import page modules
import { SettingsModule } from './pages/settings/settings.module';
import { RegularlyModule } from './pages/regularly/regularly.module';
import { HomeModule } from './pages/home/home.module';
import { BudgetsModule } from './pages/budgets/budgets.module';
import { AccountsModule } from './pages/accounts/accounts.module';
import { HistoryModule } from './pages/history/history.module';
import { InvoiceModule } from './pages/invoice/invoice.module';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    LoginComponent,
    HomeSetupComponent,
    ToastsContainerComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SettingsModule,
    RegularlyModule,
    HomeModule,
    BudgetsModule,
    AccountsModule,
    HistoryModule,
    InvoiceModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgbModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
