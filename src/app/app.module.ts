import {NgModule, isDevMode, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbDateParserFormatter, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeSetupComponent } from './components/home-setup/home-setup.component';
import { ToastsContainerComponent } from './components/toasts-container/toasts-container.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import {NgbDateCustomParserFormatter} from "../shared/formatter/ngb-date-custom-parser-formatter";

import { initializeApp } from 'firebase/app';

initializeApp(environment.firebase);

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
    NgbModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
