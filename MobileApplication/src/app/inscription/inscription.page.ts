import { EventsService } from './../providers/events.service';
import { FirebaseAnalyticsService } from './../providers/firebase-analytics.service';
import { AlertService } from './../providers/alert.service';
import { UtilsService } from './../providers/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { WsService } from './../providers/ws.service';
import { StorageService } from './../providers/storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateService } from '../providers/date.service';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
/**
 *
 *
 * @export
 * @class InscriptionPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {
  language = '';
  location = '';
  today = new Date();
  places = 0;
  nbrPlaces = 350;
  dayID = 0;
  resaAllowed = 0;
  planning = [];
  registrations = [];
  user: any;
  /**
   * Creates an instance of InscriptionPage.
   * @param {StorageService} storage
   * @param {Router} router
   * @param {DateService} date
   * @param {WsService} webService
   * @param {LoadingController} loadingController
   * @param {TranslateService} translate
   * @param {UtilsService} utils
   * @param {AlertService} alert
   * @param {AlertController} alertCtrl
   * @param {ToastController} toastCtrl
   * @param {EventsService} events
   * @param {FirebaseAnalyticsService} firebaseAnalytics
   * @memberof InscriptionPage
   */
  constructor(
    public storage: StorageService,
    public router: Router,
    public date: DateService,
    public webService: WsService,
    public loadingController: LoadingController,
    public translate: TranslateService,
    public utils: UtilsService,
    public alert: AlertService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public events: EventsService,
    public firebaseAnalytics: FirebaseAnalyticsService
  ) {
    this.firebaseAnalytics.createEvent('inscritpion_page', 'inscritpion');
    this.registrations = this.router.getCurrentNavigation().extras.state.registrations;
    this.location = this.router.getCurrentNavigation().extras.state.location;
    this.initLang();
    this.initData();
    this.getPlanning();
  }

  ngOnInit() {
  }


  /**
   *
   *
   * @memberof InscriptionPage
   * init language
   */
  initLang() {
    // Set the default language for translation strings.
    this.storage.getItem('language').then((language) => {
      if (language !== undefined && language !== null && language !== '') {
        this.language = language;
      } else {
        this.language = 'en';
      }
    });
  }

  /**
   *
   *
   * @memberof InscriptionPage
   * navigate to page after cheking if we have min resa checked
   */
  goToParking() {
    this.firebaseAnalytics.createEvent('inscritpion_next', 'button');
    let i = 0;
    let j = 0;
    for (const item of this.planning) {
      if (item.checked) {
        i++;
      }
      if (item.checked && !item.reserved) {
        j++;
      }
    }
    if (i >= this.resaAllowed && j > 0) {
      this.router.navigateByUrl('/parking', { state: { plnnning: this.planning , location: this.location } });
    } else {
      this.alert.openAlert(this.alertCtrl, 'Bel come back', this.translate.instant('MIN_RESA'));
    }

  }


  /**
   *
   *
   * @memberof InscriptionPage
   * get user planning
   */
  async getPlanning() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('PL_WAIT'),
      duration: 2000
    });
    await loading.present();
    this.webService.getUserPlanning(this.user.id)
      .subscribe((arg: any) => {
        this.planning = arg;
        // need to filter array to check other days selected from other localities
        for (const reg of this.registrations) {
          // tslint:disable-next-line: radix
          const result = this.planning.findIndex(x => x.day === reg.date); // search by day and retrun index
          // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
          if (result !== undefined && result !== -1 && this.planning[result].reserved === false && this.user.location !== parseInt(reg.id)) { // element found (Resa exists) and it's not checked
            // this.planning[result].checked = true; // check it
            this.planning[result].reserved = true; // disable it
          }
        }
        this.loadingController.dismiss();
      });

  }

  /**
   *
   *
   * @memberof InscriptionPage
   * init data page
   */
  async initData() {
    await this.storage.getObject('quota').then((quota) => {
      if (quota !== undefined && quota !== null && quota !== '') {
        this.resaAllowed = quota.nbr_resa_allowed;
      }
    });
    this.storage.getObject('user').then((user) => {
      if (user !== undefined && user !== null && user !== '') {
        this.user = user;
      }
    });
  }

  /**
   *
   *
   * @param {*} idResa
   * @memberof InscriptionPage
   * oepn alert delete user registration
   */
  async deleteReg(idResa) {
    const alert = await this.alertCtrl.create({
      header: 'Bel come back!',
      // tslint:disable-next-line: max-line-length
      message: this.translate.instant('DEL_RES'),
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.firebaseAnalytics.createEvent('inscritpion_delete_resa_no', 'button');
          }
        }, {
          text: this.translate.instant('CONFIRM'),
          cssClass: 'success',
          handler: async () => {
            this.firebaseAnalytics.createEvent('inscritpion_delete_resa_yes', 'button');
            this.events.deletedResa.next(true);
            await this.deleteSelectedReg(idResa);
          }
        }
      ]
    });

    await alert.present();

  }

  /**
   *
   *
   * @param {*} idResa
   * @memberof InscriptionPage
   * delete user registration
   */
  async deleteSelectedReg(idResa: any) {
    await this.webService.deleteRegistration(idResa).toPromise()
      .then(async (arg: any) => {
        await this.webService.getUserCrn(this.user.id, idResa).toPromise()
          .then(async (data: any) => {
            // if resa have a cantine reg then delete it
            if (data.reg_cantine.length > 0) {
              await this.webService.deleteUserCrn(data.reg_cantine[0].id).toPromise()
                .then((res: any) => {
                  this.alert.openToast(this.toastCtrl, this.translate.instant('DEL_RES_SUC'), 'bottom', 3000);
                  // refresh planning
                  this.getPlanning();
                }, err => {
                  console.log('deleteUserCrn: ' + JSON.stringify(err));
                });
            } else {
              // refresh planning
              this.getPlanning();
              this.alert.openToast(this.toastCtrl, this.translate.instant('DEL_RES_SUC'), 'bottom', 3000);
            }
          }, err => {
            console.log('getUserCrn: ' + JSON.stringify(err));
          });
      }, err => {
        this.alert.openToast(this.toastCtrl, this.translate.instant('DEL_RES_FAIL'), 'bottom', 3000);
        console.log('deleteReg: ' + JSON.stringify(err));
      });
  }

  changedResa(item) {
    // console.log('planning', this.planning); check data changing
  }
  /**
   *
   *
   * @memberof InscriptionPage
   * navigate to page
   */
  backHome() {
    this.firebaseAnalytics.createEvent('inscritpion_back_home', 'button');
    this.router.navigateByUrl('home');
  }

}
