import { FirebaseAnalyticsService } from './../../providers/firebase-analytics.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';


/**
 *
 *
 * @export
 * @class ProtectionPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-protection',
  templateUrl: './protection.page.html',
  styleUrls: ['./protection.page.scss'],
})
export class ProtectionPage implements OnInit {
  appVersionValue = '1.3.0';
  /**
   * Creates an instance of ProtectionPage.
   * @param {ModalController} modal
   * @param {AppVersion} appVersion
   * @param {Location} location
   * @param {FirebaseAnalyticsService} firebaseAnalytics
   * @memberof ProtectionPage
   */
  constructor(
    public modal: ModalController,
    public appVersion: AppVersion,
    public location: Location,
    public firebaseAnalytics: FirebaseAnalyticsService
  ) {
    this.firebaseAnalytics.createEvent('barrier_gest_page', 'barrier_gestures');
    // this.getVersionApp();
   }

  ngOnInit() {
  }

  /**
   *
   *
   * @memberof ProtectionPage
   * go back to previous page (from router history)
   */
  dismiss() {
    // this.modal.dismiss();
    this.location.back();
  }

  /**
   *
   *
   * @memberof ProtectionPage
   * get Version app only works with mobile version (pwa version set the appVersionValue directly)
   */
  getVersionApp() {
    this.appVersion.getVersionNumber().then((result) => {
      if (result !== undefined && result !== null) {
        this.appVersionValue = result;
      }
    }, err => {
      console.log('cannot get version of app ' + err);
    });
  }

}
