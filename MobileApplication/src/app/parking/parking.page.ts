import { FirebaseAnalyticsService } from './../providers/firebase-analytics.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './../providers/alert.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

/**
 *
 *
 * @export
 * @class ParkingPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-parking',
  templateUrl: './parking.page.html',
  styleUrls: ['./parking.page.scss'],
})
export class ParkingPage implements OnInit {
  parking = {
    parking: null,
  };
  parkingShow = 0;
  plnnning: any;
  location = '';

  /**
   * Creates an instance of ParkingPage.
   * @param {Router} router
   * @param {AlertService} alert
   * @param {AlertController} alertCtrl
   * @param {TranslateService} translate
   * @param {FirebaseAnalyticsService} firebaseAnalytics
   * @memberof ParkingPage
   */
  constructor(
    public router: Router,
    public alert: AlertService,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public firebaseAnalytics: FirebaseAnalyticsService
  ) {
    this.firebaseAnalytics.createEvent('parking_page', 'parking');
    this.plnnning = this.router.getCurrentNavigation().extras.state.plnnning;
    this.location = this.router.getCurrentNavigation().extras.state.location;
  }

  ngOnInit() {
  }

  /**
   *
   *
   * @memberof ParkingPage
   * go to page
   */
  goToCantine() {
    this.firebaseAnalytics.createEvent('parking_page_next', 'button');
    this.router.navigateByUrl('/cantine', { state: { planning: this.plnnning, parking: this.parking, location: this.location } });
  }

  /**
   *
   *
   * @param {*} choice
   * @memberof ParkingPage
   * choice parking
   */
  choicePrk(choice) {
    if (choice) {
      this.parking.parking = true;
      this.parkingShow = 1;
      this.firebaseAnalytics.createEvent('parking_page_parking_yes', 'button');
    } else {
      this.parking.parking = false;
      this.parkingShow = 2;
      this.firebaseAnalytics.createEvent('parking_page_parking_no', 'button');
    }
  }



}
