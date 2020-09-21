import { FirebaseAnalyticsService } from './providers/firebase-analytics.service';
import { MsalService } from '@azure/msal-angular';
import { UtilsService } from './providers/utils.service';
import { EventsService } from './providers/events.service';
import { WsService } from './providers/ws.service';
import { DataService } from './providers/data.service';
import { MsAdalService } from './providers/ms-adal.service';
import { StorageService } from './providers/storage.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { flatMap } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';


/**
 *
 *
 * @export
 * @class AppComponent
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  user: any;
  deferredPrompt: any;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
      visibility: 1
    },
    {
      title: 'resrve',
      url: '/home',
      icon: 'briefcase',
      visibility: 1
    }
  ];

  /**
   * Creates an instance of AppComponent.
   * @param {Platform} platform
   * @param {SplashScreen} splashScreen
   * @param {StatusBar} statusBar
   * @param {TranslateService} translate
   * @param {StorageService} storage
   * @param {MsAdalService} msAdal
   * @param {MsalService} auth
   * @param {Router} router
   * @param {DataService} data
   * @param {WsService} restService
   * @param {EventsService} events
   * @param {UtilsService} utils
   * @param {WsService} webService
   * @param {SwUpdate} swUpdate
   * @param {FirebaseAnalyticsService} firebaseAnalytics
   * @memberof AppComponent
   */
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private storage: StorageService,
    private msAdal: MsAdalService,
    public auth: MsalService,
    private router: Router,
    private data: DataService,
    private restService: WsService,
    private events: EventsService,
    private utils: UtilsService,
    private webService: WsService,
    private swUpdate: SwUpdate,
    private firebaseAnalytics: FirebaseAnalyticsService
  ) {
    this.user = this.data.getUser();
    this.initializeApp();
  }

  /**
   *
   *
   * @memberof AppComponent
   * init all data and params for our application / Auth
   */
  initializeApp() {
    this.platform.ready().then(() => {
      this.updateVersion();
      this.initTranslate();
      this.firebaseAnalytics.createEvent('open_app', 'preFirstPage');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.data.detectUserChanges();
      this.msAdal.init();
      this.login();
    });
  }


  /**
   *
   *
   * @memberof AppComponent
   * init Language of application
   */
  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.storage.getItem('language').then((language) => {
      if (language !== undefined && language !== null && language !== '') {
        this.translate.setDefaultLang(language);
      } else {
        this.translate.setDefaultLang('en');
        this.storage.setItem('language', 'en');
      }
    });
  }

  /**
   *
   *
   * @memberof AppComponent
   * login user
   */
  login() {
    // test user is avai or not
    this.storage.getObject('user').then(async (user) => {
      // check user local and web are identic
      if (user !== undefined && user !== null && user !== '') {
        this.restService.getUserByEmail(user.email).subscribe((data: any) => {
          if (data.user.length > 0) {
            this.getUserQuota(data.user[0].location);
            this.getUserLocation(data.user[0].location);
            const compare = this.utils.compareJsonObjects(user, data.user[0]);
            if (!compare) {
              this.events.user.next(data.user[0]);
            }
          }
        });
        this.router.navigateByUrl('/home', { state: { intro: false } });
      } else {
        // login and init data user:
        await this.loginMsal();

        // data from msal
        const firstName = this.utils.getFirstOrLastName(true, this.auth.getAccount().name);
        const lastName = this.utils.getFirstOrLastName(false, this.auth.getAccount().name);
        const email = this.utils.getFirstOrLastName(false, this.auth.getAccount().userName);

        if (email === null || email === undefined || email === '') {
          return;
        }
        this.restService.getUserByEmail(email).toPromise().then((data: any) => {
          if (data.user.length > 0) {
            this.getUserQuota(data.user[0].location);
            this.getUserLocation(data.user[0].location);
            // update user FL and LN
            this.restService.UpdateUserByFNAndLN(data.user[0].id, firstName, lastName).toPromise()
              .then((upd: any) => {
                // user found --> save user
                data.user[0].firstname = firstName;
                data.user[0].lastname = lastName;
                this.events.user.next(data.user[0]);
                this.router.navigateByUrl('/home', { state: { intro: false } });
              }, err => {
                console.log('UpdateUserByFNAndLN ' + JSON.stringify(err));
              });

          } else {
            // user not found DB --> create save user
            this.restService.createNewUser(firstName, lastName, email).pipe(
              flatMap(userID => this.restService.getUserByID(userID))
              // tslint:disable-next-line: no-shadowed-variable
            ).subscribe((user: any) => {
              this.getUserQuota(user.location);
              this.events.user.next(user);
              this.router.navigateByUrl('/profil', { state: { showNavbar: false } });
            }, err => {
              console.log('createNewUser ' + JSON.stringify(err));
            });
          }
        }, err => {
          console.log('getUserEmail ' + JSON.stringify(err));
        });
      }
    });
  }


  /**
   *
   *
   * @memberof AppComponent
   * login azure
   */
  async loginMsal() {
    this.msAdal.login();
  }

  /**
   *
   *
   * @memberof AppComponent
   * this method is user to reload application when a new version is available (only pwa)
   */
  updateVersion() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available, Load new Version')) {
          window.location.reload();
        }
      });
    }
  }

  /**
   *
   *
   * @param {*} locationID
   * @memberof AppComponent
   * get user location
   */
  async getUserLocation(locationID) {
    await this.webService.getLocalityByID(locationID).toPromise()
      .then((arg: any) => {
        this.events.location.next(arg);
        this.storage.setObject('location', arg);
      }, err => {
        console.log('getUserLocation ' + JSON.stringify(err));
      });
  }

  /**
   *
   *
   * @param {*} location
   * @memberof AppComponent
   * get user data
   */
  async getUserQuota(location) {
    await this.webService.getQuota(location).toPromise().then((arg: any) => {
      this.storage.setObject('quota', arg.quota[0]);
    });
  }

}
