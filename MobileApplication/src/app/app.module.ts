import { FirebaseAnalyticsService } from './providers/firebase-analytics.service';
import { environment } from './../environments/environment.prod';
import { MSAdal } from '@ionic-native/ms-adal/ngx';
import { AlertService } from './providers/alert.service';
import { WsService } from './providers/ws.service';
import { UtilsService } from './providers/utils.service';
import { DataService } from './providers/data.service';
import { DateService } from './providers/date.service';
import { MsAdalService } from './providers/ms-adal.service';
import { ProtectionPageModule } from './modals/protection/protection.module';
import { EventsService } from './providers/events.service';
import { StorageService } from './providers/storage.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModifyResaPageModule } from './modals/modify-resa/modify-resa.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import * as firebase from 'firebase/app';

firebase.initializeApp(environment.firebaseConfig);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]
];

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    // Msal Azure auth config to complete
    MsalModule.forRoot({
      auth: {
        clientId: 'client id',
        authority: 'link authority',
        validateAuthority: true,
        redirectUri: 'redirect url',
        postLogoutRedirectUri: 'redirect logout url',
        navigateToLoginRequestUrl: true,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
    },
      {
        popUp: !isIE,
        consentScopes: [
          'user.read',
          'openid',
          'profile'
        ],
        unprotectedResources: ['https://www.microsoft.com/en-us/'],
        protectedResourceMap,
        extraQueryParameters: {}
      }),
    ModifyResaPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    StorageService,
    EventsService,
    MSAdal,
    AppVersion,
    InAppBrowser,
    MsAdalService,
    DateService,
    DataService,
    UtilsService,
    WsService,
    AlertService,
    FirebaseAnalyticsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
