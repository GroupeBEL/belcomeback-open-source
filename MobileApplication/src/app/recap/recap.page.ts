import { FirebaseAnalyticsService } from './../providers/firebase-analytics.service';
import { UtilsService } from './../providers/utils.service';
import { AlertService } from './../providers/alert.service';
import { DataService } from './../providers/data.service';
import { WsService } from './../providers/ws.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './../providers/storage.service';
import { DateService } from './../providers/date.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

/**
 *
 *
 * @export
 * @class RecapPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-recap',
  templateUrl: './recap.page.html',
  styleUrls: ['./recap.page.scss'],
})
export class RecapPage implements OnInit {
  language = '';
  location = '';
  data: any;
  time = '';
  parking = 0;
  planning: any;
  park = [];
  cant = [];
  countReg = 0;
  /**
   * Creates an instance of RecapPage.
   * @param {DateService} date
   * @param {Router} router
   * @param {StorageService} storage
   * @param {AlertController} alertController
   * @param {ToastController} toastCtrl
   * @param {TranslateService} translate
   * @param {WsService} webService
   * @param {DataService} dataSrv
   * @param {AlertService} alert
   * @param {UtilsService} utils
   * @param {LoadingController} loadingController
   * @param {FirebaseAnalyticsService} firebaseAnalytics
   * @memberof RecapPage
   */
  constructor(
    public date: DateService,
    public router: Router,
    public storage: StorageService,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public webService: WsService,
    public dataSrv: DataService,
    public alert: AlertService,
    public utils: UtilsService,
    public loadingController: LoadingController,
    public firebaseAnalytics: FirebaseAnalyticsService
  ) {
    this.firebaseAnalytics.createEvent('resume_page', 'Resume');
    this.language = this.router.getCurrentNavigation().extras.state.language;
    this.location = this.router.getCurrentNavigation().extras.state.location;
    this.data = this.router.getCurrentNavigation().extras.state.cantine;
    this.planning = this.router.getCurrentNavigation().extras.state.planning;
    this.time = this.data.passHour;
    this.parking = this.data.parking;
    this.initDates();
    this.getCountRegToAdd();
  }

  ngOnInit() {
  }


  /**
   *
   *
   * @param {*} des
   * @memberof RecapPage
   * Conditional navigate to page
   */
  goToHome(des) {
    if (des) {
      this.firebaseAnalytics.createEvent('resume_page_coming', 'button');
      this.confrimReservation();
    } else {
      this.firebaseAnalytics.createEvent('resume_page_not_coming', 'button');
      this.router.navigateByUrl('/home', { state: { intro: false } });
    }
  }

  /**
   *
   *
   * @memberof RecapPage
   * alert confirm user reservation
   */
  async confrimReservation() {
    let cantine = '';
    let date = '';
    if (this.time !== '') {
      cantine = '<br>' + this.translate.instant('CANTEEN') + ': ' + this.utils.getCustomString(this.time, 0, 5);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.planning.length; index++) {
      const element = this.planning[index];
      if (element.checked && !element.reserved) {
        date += this.date.getCustomDateFormatted(this.language, element.day, 'dddd DD MMMM') + '<br>';
      }
    }
    const alert = await this.alertController.create({
      header: 'Bel come back!',
      // tslint:disable-next-line: max-line-length
      message: this.translate.instant('CONFIRM_RES') + ' ' + this.location + '<br><br>' + date + '<br>' + 'Parking: ' + this.translate.instant('RECAP_PAR') + '<br>' + cantine,
      backdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.firebaseAnalytics.createEvent('resume_page_coming_no', 'button');
          }
        }, {
          text: this.translate.instant('CONFIRM'),
          cssClass: 'success',
          handler: async () => {
            this.firebaseAnalytics.createEvent('resume_page_coming_yes', 'button');
            await this.addRegistration();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   *
   *
   * @memberof RecapPage
   * add user registrations (calls addRegistrations)
   */
  async addRegistration() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('PL_WAIT'),
    });
    await loading.present();
    this.storage.getObject('user').then(async (user) => {
      if (user !== undefined && user !== null) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < this.planning.length; index++) {
          const element = this.planning[index];
          // checked not reserved and places exist for people
          if (element.checked && !element.reserved && element.nbrFreePlaces > 0) {
            await this.addRegistrations(user, element, index);
          }
        }
      } else {
        this.alert.openToast(this.toastCtrl, this.translate.instant('REG_FAIL'), 'bottom', 3000);
      }
    });

  }

  /**
   *
   *
   * @memberof RecapPage
   * return the number of registrations to add
   */
  getCountRegToAdd() {
    // tslint:disable-next-line: prefer-for-of
    let lgth = this.planning.length;

    while (lgth--) {
      const element = this.planning[lgth];
      if (element.checked && !element.reserved && element.nbrFreePlaces > 0) {
        break;
      }
    }
    this.countReg = lgth;
  }


  /**
   *
   *
   * @param {{ id: any; firstname: string; lastname: string; email: string; num_badge: number; token_notification: string; country: number; location: number; id_day: number; date_creation: string; admin: number; }} user
   * @param {*} element
   * @param {number} index
   * @memberof RecapPage
   * add Regisration
   */
  // tslint:disable-next-line: max-line-length
  async addRegistrations(user: { id: any; firstname: string; lastname: string; email: string; num_badge: number; token_notification: string; country: number; location: number; id_day: number; date_creation: string; admin: number; }, element: any, index: number) {
    let parking;
    // check if parking places are avai otherwise set parking to false
    if (element.nbrFreePlacesParking <= 0) {
      parking = false;
    } else {
      parking = this.data.parking;
    }
    await this.webService.addUserRegistration(user.id, element.dayID, element.day, parking, user.location).toPromise()
      .then(async (arg: any) => {
        // tslint:disable-next-line: max-line-length
        if (this.data.cantine && element.nbrFreePlacesCantine > 0 && element.subs !== undefined && element.subs > 0) {
          // adding crn
          await this.webService.addUserCrn(user.id, this.data.cantineID, element.dayID).toPromise()
            .then((res: any) => {
              if (index === this.countReg) {
                this.loadingController.dismiss();
                this.alert.openToast(this.toastCtrl, this.translate.instant('REG_SUCC'), 'bottom', 3000);
                this.router.navigateByUrl('/confirmed', { state: { data: this.data } });
              }
            }, err => {
              this.loadingController.dismiss();
              // in case of failing adding crn delete reg
              this.webService.deleteRegistration(arg);
              this.alert.openToast(this.toastCtrl, this.translate.instant('REG_FAIL'), 'bottom', 3000);
            });
        } else {
          if (index === this.countReg) {
            this.loadingController.dismiss();
            this.alert.openToast(this.toastCtrl, this.translate.instant('REG_SUCC'), 'bottom', 3000);
            this.router.navigateByUrl('/confirmed', { state: { data: this.data } });
          }
        }
      }, err => {
        this.loadingController.dismiss();
        this.alert.openToast(this.toastCtrl, this.translate.instant('REG_FAIL'), 'bottom', 3000);
        console.log('addRegistration ' + JSON.stringify(err));
      });
  }

  /**
   *
   *
   * @memberof RecapPage
   * add dates and places parking/canteen to array data
   */
  async initDates() {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.planning.length; index++) {
      const prk = {
        day: '',
        places_parking: 0,
      };
      const cnt = {
        day: '',
        places_canteen: 0
      };
      const element = this.planning[index];
      if (element.checked && !element.reserved) {
        prk.day = this.date.getCustomDateFormatted(this.language, element.day, 'dddd DD MMMM');
        cnt.day = this.date.getCustomDateFormatted(this.language, element.day, 'dddd DD MMMM');
        prk.places_parking = element.nbrFreePlacesParking;
        cnt.places_canteen = element.nbrFreePlacesCantine;
        this.park.push(prk);
        this.cant.push(cnt);
      }
    }
  }

}
