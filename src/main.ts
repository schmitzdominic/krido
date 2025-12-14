/// <reference types="@angular/localize" />

import { platformBrowser } from '@angular/platform-browser';
import { setLogLevel, LogLevel } from "@angular/fire";
import { AppModule } from './app/app.module';

setLogLevel(LogLevel.SILENT);

platformBrowser().bootstrapModule(AppModule).catch(err => console.error(err));
