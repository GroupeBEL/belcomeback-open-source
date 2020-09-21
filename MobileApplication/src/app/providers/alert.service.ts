import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
/**
 *
 *
 * @export
 * @classdesc AlertService
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
/**
 *
 *
 * @param {AlertController} alertCtrl
 * @param {string} titleAlert
 * @param {string} subtitle
 * @memberof AlertService
 * create a custom Alert
 */
async openAlert(alertCtrl: AlertController, titleAlert: string, subtitle: string) {
    const alert = await alertCtrl.create({
      header: titleAlert,
      message: subtitle,
      buttons: ['Dismiss']
    });
    await alert.present();
  }
/**
 *
 *
 * @param {ToastController} toastCtrl
 * @param {string} mMessage
 * @param {*} mPosition
 * @param {*} mDuration
 * @memberof AlertService
 * create a custom Toast
 */
async openToast(toastCtrl: ToastController, mMessage: string, mPosition: any, mDuration: any) {
    const toast = await toastCtrl.create({
      message: mMessage,
      duration: mDuration,
      position: mPosition
    });
    await toast.present();
  }

}
