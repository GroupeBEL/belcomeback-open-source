import { EventsService } from './../providers/events.service';
import { FirebaseAnalyticsService } from './../providers/firebase-analytics.service';
import { UtilsService } from './../providers/utils.service';
import { AlertService } from './../providers/alert.service';
import { AlertController, ToastController } from '@ionic/angular';
import { StorageService } from './../providers/storage.service';
import { Router } from '@angular/router';
import { WsService } from './../providers/ws.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MsAdalService } from './../providers/ms-adal.service';
import { Component, OnInit } from '@angular/core';

/**
 *
 *
 * @export
 * @class ProfilPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  localities = [];
  form: FormGroup;
  showNavbar = true;
  language = '';

  /**
   * Creates an instance of ProfilPage.
   * @param {MsAdalService} msAdal
   * @param {TranslateService} translate
   * @param {FormBuilder} formBuilder
   * @param {WsService} webService
   * @param {Router} router
   * @param {StorageService} storage
   * @param {AlertController} alertCtrl
   * @param {AlertService} alert
   * @param {ToastController} toastCtrl
   * @param {UtilsService} utils
   * @param {FirebaseAnalyticsService} firebaseAnalytics
   * @param {EventsService} events
   * @memberof ProfilPage
   */
  constructor(
    public msAdal: MsAdalService,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public webService: WsService,
    public router: Router,
    public storage: StorageService,
    public alertCtrl: AlertController,
    public alert: AlertService,
    public toastCtrl: ToastController,
    public utils: UtilsService,
    public firebaseAnalytics: FirebaseAnalyticsService,
    public events: EventsService
  ) {
    this.firebaseAnalytics.createEvent('profile_page', 'Profile');
    this.showNavbar = this.router.getCurrentNavigation().extras.state.showNavbar;
    this.detectNavChanges();
    this.getLocalities();
    this.initForm();
    setTimeout(() => {
      this.initDataForm();
    }, 200);

  }
  /**
   *
   *
   * @memberof ProfilPage
   * detect showNavbar changes (showNavbar is user to hide/show dismiss page button)
   */
  detectNavChanges() {
    this.events.navDataIos.subscribe((navDataIos) => {
      if (navDataIos !== undefined) {
        this.showNavbar = navDataIos;
      }
    });
  }

  ngOnInit() {
  }

  /**
   *
   *
   * @memberof ProfilPage
   * dismiss page (navigation)
   */
  dismiss() {
    this.firebaseAnalytics.createEvent('profile_page_dismiss', 'button');
    this.router.navigateByUrl('/home', { state: { intro: false } });
  }
  getFormData() {

  }
  /**
   *
   *
   * @memberof ProfilPage
   * init form profile page
   */
  initForm() {
    this.form = this.formBuilder.group({
      locality: [null, Validators.required],
      language: ['', Validators.required],
    });
  }

  /**
   *
   *
   * @memberof ProfilPage
   * get locatities
   */
  getLocalities() {
    this.webService.getLocalities().toPromise()
      .then((arg: any) => {
        this.localities = arg.location;
      });
  }

  /**
   *
   *
   * @memberof ProfilPage
   * update user profile (calls do Update)
   */
  async updateProfile() {
    const langApp = this.form.get('language').value;
    const locality = this.form.get('locality').value;
    this.firebaseAnalytics.createEvent('profile_update', 'button');
    await this.storage.getObject('user').then((user) => {
      if (user !== undefined && user !== null) {
        this.doUpdate(user, locality, langApp);
      }
    });
  }

  /**
   *
   *
   * @param {*} user
   * @param {*} locality
   * @param {*} langApp
   * @memberof ProfilPage
   * update profile
   */
  doUpdate(user: any, locality: any, langApp: any) {
    this.webService.UpdateUserLocality(user.id, locality).toPromise()
      .then(arg => {
        // update local data
        user.location = locality;
        this.getUserLocation(locality);
        this.getUserQuota(locality);
        this.storage.setObject('user', user);
        this.utils.useLanguage(langApp);
        this.storage.setItem('language', langApp);
        this.router.navigateByUrl('/home', { skipLocationChange: true, state: { intro: false } });
      }, err => {
        this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_USER_FAIL'), 'bottom', 3000);
        console.log('UpdateUserLocality ' + JSON.stringify(err));
      });
  }

  /**
   *
   *
   * @memberof ProfilPage
   * event change language
   */
  changeLang() {
    this.firebaseAnalytics.createEvent('profile_language_selected', 'button');
  }

  /**
   *
   *
   * @memberof ProfilPage
   * event cancel change language
   */
  langCancel() {
    this.firebaseAnalytics.createEvent('profile_language_cancel', 'button');
  }

  /**
   *
   *
   * @memberof ProfilPage
   * event change location
   */
  changeLoc() {
    this.firebaseAnalytics.createEvent('profile_locality_selected', 'button');
  }

  /**
   *
   *
   * @memberof ProfilPage
   * event cancel change location
   */
  locCancel() {
    this.firebaseAnalytics.createEvent('profile_locality_cancel', 'button');
  }

  /**
   *
   *
   * @memberof ProfilPage
   * alert logout user
   */
  async logOut() {
    this.firebaseAnalytics.createEvent('profile_logout', 'button');
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('LOGOUT'),
      message: this.translate.instant('LOGOUT_SURE'),
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          role: 'cancel',
          handler: () => {
            this.firebaseAnalytics.createEvent('profile_logout_cancel', 'button');
          }
        },
        {
          text: this.translate.instant('LOGOUT'),
          handler: async () => {
            this.firebaseAnalytics.createEvent('profile_logout_ok', 'button');
            await this.logoutAndClearStorage();
            this.router.navigateByUrl('/intro');
            // this.platform.exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   *
   *
   * @memberof ProfilPage
   * logout user and delete all storage data
   */
  async logoutAndClearStorage() {
    this.msAdal.logout();
    this.storage.clear();
  }

  /**
   *
   *
   * @memberof ProfilPage
   * navigate to page
   */
  openGtBr() {
    this.firebaseAnalytics.createEvent('profile_go_barrier', 'button');
    this.router.navigateByUrl('/protection');
  }

  /**
   *
   *
   * @memberof ProfilPage
   * init data form
   */
  async initDataForm() {
    await this.storage.getItem('language').then((language) => {
      if (language !== undefined && language !== null && language !== '') {
        this.form.get('language').setValue(language);
      } else {
        this.form.get('language').setValue('en');
      }
    });
    await this.storage.getObject('user').then((user) => {
      if (user !== undefined && user !== null) {
        this.form.get('locality').setValue(user.location);
      }
    });
  }
  /**
   *
   *
   * @param {*} locationID
   * @memberof ProfilPage
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
   * @memberof ProfilPage
   * get user quota
   */
  async getUserQuota(location) {
    await this.webService.getQuota(location).toPromise().then((arg: any) => {
      this.storage.setObject('quota', arg.quota[0]);
    });
  }


}
