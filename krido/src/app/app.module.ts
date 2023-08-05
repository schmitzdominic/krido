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
        AngularFireModule.initializeApp(environment.firebase),
        NgbModule,
        AppRoutingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule
    ],
  providers: [
    ScreenTrackingService,UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
