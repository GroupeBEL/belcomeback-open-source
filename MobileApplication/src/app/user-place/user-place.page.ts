import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './../providers/storage.service';
import { WsService } from './../providers/ws.service';
import { DateService } from './../providers/date.service';
import { UtilsService } from './../providers/utils.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

/**
 *
 *
 * @export
 * @class UserPlacePage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-user-place',
  templateUrl: './user-place.page.html',
  styleUrls: ['./user-place.page.scss'],
})
export class UserPlacePage implements OnInit {

  places = [];
  language = '';
  today = new Date();
  reservation: any;

  /**
   * Creates an instance of UserPlacePage.
   * @param {Router} router
   * @param {UtilsService} utils
   * @param {DateService} date
   * @param {WsService} webService
   * @param {StorageService} storage
   * @param {LoadingController} loadingController
   * @param {TranslateService} translate
   * @memberof UserPlacePage
   */
  constructor(
    public router: Router,
    public utils: UtilsService,
    public date: DateService,
    public webService: WsService,
    public storage: StorageService,
    public loadingController: LoadingController,
    public translate: TranslateService
  ) {
    this.reservation = this.router.getCurrentNavigation().extras.state.reservation;

    this.initLang();
    this.getPlacesByLocality();
  }

  ngOnInit() {
  }

  /**
   *
   *
   * @memberof UserPlacePage
   * navigate to page
   */
  backHome() {
    this.router.navigateByUrl('/home', { state: { intro: false } });
  }

  /**
   *
   *
   * @memberof UserPlacePage
   * init language
   */
  async initLang() {
    // Set the default language for translation strings.
    await this.storage.getItem('language').then((language) => {
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
   * @memberof UserPlacePage
   * get places by locality
   */
  async getPlacesByLocality() {
    this.storage.getObject('user').then(async (user) => {
      if (user !== undefined && user !== null) {
        const loading = await this.loadingController.create({
          message: this.translate.instant('PL_WAIT')
        });
        await loading.present();
        await this.webService.getPlacesByLocality(this.reservation.id).toPromise()
          .then(async (arg: any) => {
            if (arg.lieu.length > 0) {
              this.places = arg.lieu;
              // tslint:disable-next-line: prefer-for-of
              for (let index = 0; index < this.places.length; index++) {
                await this.webService.getNbrPeopleInPlace(this.places[index].id).toPromise()
                  .then((res: any) => {
                    this.places[index].people = res;
                  }, err => {
                    console.log('getNbrPeopleInPlace' + JSON.stringify(err));
                  });
              }
              this.loadingController.dismiss();
            }
          }, err => {
            this.loadingController.dismiss();
            console.log('getPlacesByLocality' + JSON.stringify(err));
          });
      }
    });
  }

  /**
   *
   *
   * @param {*} place
   * @param {*} inOut
   * @memberof UserPlacePage
   * change user place status (in/out)
   */
  async changePlaceStatus(place, inOut) {
    if (inOut) {
      // enter place
      await this.webService.goInLocation(place.id).toPromise()
        .then((arg: any) => {
          this.getPlacesByLocality();
        }, err => {
          console.log('goInLocation' + JSON.stringify(err));
        });
    } else {
      // leave place
      await this.webService.goOutLocation(place.id).toPromise()
        .then((arg: any) => {
          this.getPlacesByLocality();
        }, err => {
          console.log('goOutLocation' + JSON.stringify(err));
        });
    }
  }



  /**
   *
   *
   * @param {*} event
   * @memberof UserPlacePage
   * refresh list of places / users number
   */
  doRefresh(event) {
    setTimeout(() => {
      this.getPlacesByLocality();
      event.target.complete();
    }, 2000);
  }
}
