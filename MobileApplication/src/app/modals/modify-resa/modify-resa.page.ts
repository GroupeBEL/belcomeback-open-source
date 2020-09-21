import { FirebaseAnalyticsService } from './../../providers/firebase-analytics.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './../../providers/alert.service';
import { UtilsService } from './../../providers/utils.service';
import { StorageService } from './../../providers/storage.service';
import { DateService } from './../../providers/date.service';
import { WsService } from './../../providers/ws.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

/**
 *
 *
 * @export
 * @class ModifyResaPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-modify-resa',
  templateUrl: './modify-resa.page.html',
  styleUrls: ['./modify-resa.page.scss'],
})
export class ModifyResaPage implements OnInit {
  parkingShow = 0;
  noCantine = '0';
  parking = false;
  parkingRes: any;
  parkingDispo = 0;
  CantineDispo = 0;
  form: FormGroup;
  cancel = 'Cancel';
  crns = [];
  reservation: any;

  /**
   * Creates an instance of ModifyResaPage.
   * @param {ModalController} modal
   * @param {WsService} webService
   * @param {DateService} date
   * @param {StorageService} storage
   * @param {FormBuilder} formBuilder
   * @param {UtilsService} utils
   * @param {NavParams} navParams
   * @param {AlertService} alert
   * @param {ToastController} toastCtrl
   * @param {TranslateService} translate
   * @param {AlertController} alertCtrl
   * @param {FirebaseAnalyticsService} firebaseAnalytics
   * @memberof ModifyResaPage
   */
  constructor(
    public modal: ModalController,
    public webService: WsService,
    public date: DateService,
    public storage: StorageService,
    public formBuilder: FormBuilder,
    public utils: UtilsService,
    public navParams: NavParams,
    public alert: AlertService,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public firebaseAnalytics: FirebaseAnalyticsService
  ) {
    this.firebaseAnalytics.createEvent('modify_page', 'modify');
    this.cancel = this.translate.instant('CANCEL');
    this.reservation = navParams.get('reservation');
    if (this.reservation.parking === '1') {
      this.parking = true;
      this.parkingShow = 1;
    } else {
      this.parkingShow = 2;
      this.parking = false;
    }
    this.initForm();
    this.getParkingDispo(this.reservation.day_id);
    setTimeout(() => {
      this.getCreneauxDispo(this.reservation.day_id);
    }, 200);
    // tslint:disable-next-line: radix
    this.CantineDispo = this.utils.getDiffValues(parseInt(this.reservation.nb_couverts), parseInt(this.reservation.cantineused));
  }

  getFormData() {

  }

  /**
   *
   *
   * @memberof ModifyResaPage
   * init form modifyPage
   */
  initForm() {
    this.form = this.formBuilder.group({
      canteen: [null]
    });
  }
  /**
   *
   *
   * @memberof ModifyResaPage
   * detect slots change
   */
  changeTime() {
    this.firebaseAnalytics.createEvent('crn_selected', 'button');
    // this.getCreTime(this.form.get('canteen').value);
  }
  /**
   *
   *
   * @memberof ModifyResaPage
   * detect cancel event
   */
  onCancel() {
    this.firebaseAnalytics.createEvent('crn_dismiss', 'button');
  }

  ngOnInit() {
  }

  /**
   *
   *
   * @memberof ModifyResaPage
   * dismiss modal
   */
  dismiss() {
    this.firebaseAnalytics.createEvent('modify_dismiss', 'button');
    this.modal.dismiss(false);
  }

  /**
   *
   *
   * @param {*} choice
   * @memberof ModifyResaPage
   * choice for parking
   */
  choicePrk(choice) {
    if (choice) {
      this.parking = true;
      this.parkingShow = 1;
      this.firebaseAnalytics.createEvent('modify_page_parking_yes', 'button');
    } else {
      this.parking = false;
      this.parkingShow = 2;
      this.firebaseAnalytics.createEvent('modify_page_parking_no', 'button');
    }
  }
  /**
   *
   *
   * @param {*} dayID
   * @memberof ModifyResaPage
   * get available slots
   */
  async getCreneauxDispo(dayID) {
    this.webService.getCrnForDay(dayID)
      .subscribe((arg: any) => {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < arg.length; index++) {
          if (arg[index].idct !== null) {
            // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
            const places = parseInt(arg[index].nb_places) > parseInt(arg[index].nbre) ? parseInt(arg[index].nb_places) - parseInt(arg[index].nbre) : 0; // data received format string , we need to parse othewise it's not needed
            arg[index].subs = places;
            if (this.reservation.crnID !== '' && this.reservation.crnID !== undefined && this.reservation.id_creneau === arg[index].idct) {
              this.form.get('canteen').setValue(this.reservation.id_creneau);
            }
            this.crns.push(arg[index]);
          }
        }
      }, err => {
        console.log('getCrnForDay' + JSON.stringify(err));
      });
  }


  /**
   *
   *
   * @param {*} dayID
   * @memberof ModifyResaPage
   * get parking available places
   */
  async getParkingDispo(dayID) {
    await this.webService.getParkingDispoForDay(dayID)
      .subscribe((arg: any) => {
        if (arg.length > 0) {
          this.parkingRes = arg[0].nbrParkingRsv;
          // tslint:disable-next-line: radix
          this.parkingDispo = this.utils.getDiffValues(parseInt(this.reservation.nb_places_parking), parseInt(this.parkingRes));
        } else {
          this.parkingRes = '0';
          // tslint:disable-next-line: radix
          this.parkingDispo = this.utils.getDiffValues(parseInt(this.reservation.nb_places_parking), parseInt(this.parkingRes));
        }
      }, err => {
        console.log('getParkingDispo' + JSON.stringify(err));
      });

  }

  /**
   *
   *
   * @memberof ModifyResaPage
   *  alert update user Reservation
   */
  async updateResa() {
    const alert = await this.alertCtrl.create({
      header: 'Bel come back!',
      // tslint:disable-next-line: max-line-length
      message: this.translate.instant('UPD_RES'),
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.firebaseAnalytics.createEvent('update_resa_no', 'button');
          }
        }, {
          text: this.translate.instant('CONFIRM'),
          cssClass: 'success',
          handler: async () => {
            this.firebaseAnalytics.createEvent('update_resa_yes', 'button');
            await this.updateSelectedResa();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   *
   *
   * @memberof ModifyResaPage
   * update user Reservation
   */
  async updateSelectedResa() {
    const dayID = this.reservation.day_id;
    await this.storage.getObject('user').then(async (user) => {
      if (user !== undefined && user !== null) {
        // update cantine
        await this.updateCrn(user, dayID).then(async () => {
          // then update parking
          await this.updateParking(user, dayID).then(() => {
            this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_SUC'), 'bottom', 3000);
            this.modal.dismiss(true);
          }, err => {
            this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_SUC'), 'bottom', 3000);
            console.log('can you detect err parking ' + JSON.stringify(err));
          });
        }, err => {
          this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_FAIL'), 'bottom', 3000);
          console.log('can you detect err cantine ' + JSON.stringify(err));
        });
      } else {
        this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_FAIL'), 'bottom', 3000);
      }
    });
  }

  /**
   *
   *
   * @param {*} user
   * @param {*} dayID
   * @memberof ModifyResaPage
   * update user parking
   */
  async updateParking(user, dayID) {
      await this.webService.getUserRegisrationByDayID(user.id, dayID).toPromise()
        .then(async (arg: any) => {
          if (arg.register.length > 0) {
            await this.webService.updateParkingRegistration(arg.register[0].id, this.parking).toPromise()
              .then((res: any) => {
                // this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_PRK_SUC'), 'bottom', 3000);
              }, err => {
                // this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_PRK_FAIL'), 'bottom', 3000);
                console.log('updateParkingRegistration: ' + JSON.stringify(err));
              });
          } else {
            console.log('do nothing UPDATE Parking ');
          }
        }, err => {
          // this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_PRK_FAIL'), 'bottom', 3000);
          console.log('getUserRegisrationByDayID UPDATE: ' + JSON.stringify(err));
        });
  }

  /**
   *
   *
   * @param {*} user
   * @param {*} dayID
   * @memberof ModifyResaPage
   * update User Slot Reservation
   */
  async updateCrn(user, dayID) {
    if (this.form.get('canteen').value !== null && this.form.get('canteen').value !== undefined) {
      await this.webService.getUserCrn(user.id, dayID).toPromise()
        .then(async (data: any) => {
          if (data.reg_cantine.length > 0) {
            if (this.form.get('canteen').value === '0') { // user don't wanna go to canteen
              await this.webService.deleteUserCrn(data.reg_cantine[0].id).toPromise()
                .then((res: any) => {
                  // this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_CRN_SUC'), 'bottom', 3000);
                }, err => {
                  // this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_CRN_FAIL'), 'bottom', 3000);
                  console.log('deleteUserCrn UPDATE: ' + JSON.stringify(err));
                });
            } else {
              // update value crn
              // tslint:disable-next-line: max-line-length
              await this.webService.updateUserCrn(data.reg_cantine[0].id, user.id, dayID, parseInt(this.form.get('canteen').value)).toPromise()
                .then((repl: any) => {
                  this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_CRN_SUC'), 'bottom', 3000);
                }, err => {
                  // this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_CRN_FAIL'), 'bottom', 3000);
                  console.log('update UserCrn: ' + JSON.stringify(err));
                });
            }
          } else {
            // user don't have CRN
            if (this.form.get('canteen').value !== '0') {
              // tslint:disable-next-line: radix
              await this.webService.addUserCrn(user.id, parseInt(this.form.get('canteen').value), dayID).toPromise()
                .then((res: any) => {
                  // this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_CRN_SUC'), 'bottom', 3000);
                }, err => {
                  // this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_CRN_FAIL'), 'bottom', 3000);
                  console.log('addUserCrn ' + JSON.stringify(err));
                });
            } else {
              // console.log('user dont have CRN and wanna go to canteen');
            }
          }
        }, err => {
          // this.alert.openToast(this.toastCtrl, this.translate.instant('UPD_RES_CRN_FAIL'), 'bottom', 3000);
          console.log('getUserCrn: ' + JSON.stringify(err));
        });
    }
  }

  /**
   *
   *
   * @memberof ModifyResaPage
   * alert Delete user reservation
   */
  async deleteResa() {
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
            this.firebaseAnalytics.createEvent('delete_resa_no', 'button');
          }
        }, {
          text: this.translate.instant('CONFIRM'),
          cssClass: 'success',
          handler: async () => {
            this.firebaseAnalytics.createEvent('delete_resa_yes', 'button');
            await this.deleteSelectedReg();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   *
   *
   * @memberof ModifyResaPage
   * Delete user reservation
   */
  async deleteSelectedReg() {
    const dayID = this.reservation.day_id;
    await this.storage.getObject('user').then(async (user) => {
      if (user !== undefined && user !== null) {
        // get resa of user
        await this.webService.getUserRegisrationByDayID(user.id, dayID).toPromise()
          .then(async (arg: any) => {
            if (arg.register.length > 0) {
              // delete it
              await this.webService.deleteRegistration(arg.register[0].id).toPromise()
                .then(async (resp: any) => {
                  // check if this resa have a crn
                  await this.webService.getUserCrn(user.id, dayID).toPromise()
                    .then(async (data: any) => {
                      if (data.reg_cantine.length > 0) {
                        // if yes delete it
                        await this.webService.deleteUserCrn(data.reg_cantine[0].id).toPromise()
                          .then((res: any) => {
                            this.alert.openToast(this.toastCtrl, this.translate.instant('DEL_RES_SUC'), 'bottom', 3000);
                            this.modal.dismiss(true);
                          }, err => {
                            console.log('deleteUserCrn: ' + JSON.stringify(err));
                          });
                      } else {
                        this.alert.openToast(this.toastCtrl, this.translate.instant('DEL_RES_SUC'), 'bottom', 3000);
                        this.modal.dismiss(true);
                      }
                    }, err => {
                      console.log('getUserCrn: ' + JSON.stringify(err));
                    });
                }, err => {
                  this.alert.openToast(this.toastCtrl, this.translate.instant('DEL_RES_FAIL'), 'bottom', 3000);
                  console.log('deleteReg: ' + JSON.stringify(err));
                });
            } else {
              // console.log('do nothing delete nothing ');
            }
          }, err => {
            this.alert.openToast(this.toastCtrl, this.translate.instant('DEL_RES_FAIL'), 'bottom', 3000);
            console.log('getUserRegisrationByDayID UPDATE: ' + JSON.stringify(err));
          });
      } else {
        this.alert.openToast(this.toastCtrl, this.translate.instant('DEL_RES_FAIL'), 'bottom', 3000);
      }
    });

  }


  /**
   *
   *
   * @param {*} val
   * @return {*}
   * @memberof ModifyResaPage
   * used for ngStyle in html to return a color
   */
  setColor(val) {
    if (val > 10) {
      return 'green';
    } else {
      return 'red';
    }
  }

}
