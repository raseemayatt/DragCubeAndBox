import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {NgxPrintModule} from 'ngx-print';



// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';;
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpResponseInterceptorService } from './_services/http.response.interpreter.service';
import { TopbarComponent } from './loggedin/layout/topbar';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule ,
        BrowserAnimationsModule  ,
        OverlayModule,
        NgxSpinnerModule,
        NgbModule,
        NgxPrintModule
    ],
    declarations: [
        AppComponent        
    ],

    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptorService, multi: true },
        { provide: LocationStrategy, useClass: HashLocationStrategy},

        // provider used to create fake backend
        fakeBackendProvider
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

    bootstrap: [AppComponent]
})
export class AppModule { };