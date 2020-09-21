import { FirebaseAnalyticsService } from './../providers/firebase-analytics.service';
import { ModifyResaPage } from './../modals/modify-resa/modify-resa.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { MsAdalService } from './../providers/ms-adal.service';
import { DateService } from './../providers/date.service';
import { DataService } from './../providers/data.service';
import { WsService } from './../providers/ws.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from './../providers/utils.service';
import { EventsService } from './../providers/events.service';
import { StorageService } from './../providers/storage.service';
import { Component } from '@angular/core';
import { PopoverController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';

/**
 *
 *
 * @export
 * @class HomePage
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  language = '';
  name = '';
  location = '';
  user: any;
  registration = false;
  Allregs = [];
  introNav = false;

  /**
   *
   * @param {PopoverController} popoverController
   * @param {StorageService} storage
   * @param {EventsService} events
   * @param {ModalController} modal
   * @param {Router} router
   * @param {UtilsService} utils
   * @param {InAppBrowser} iab
   * @param {TranslateService} translate
   * @param {AlertController} alertCtrl
   * @param {WsService} webService
   * @param {DataService} data
   * @param {DateService} date
   * @param {MsAdalService} msAdal
   * @param {LoadingController} loadingController
   * @param {AlertController} alertController
   * @param {FirebaseAnalyticsService} firebaseAnalytics
   * @memberof HomePage
   */
  constructor(
    public popoverController: PopoverController,
    public storage: StorageService,
    public events: EventsService,
    public modal: ModalController,
    public router: Router,
    public utils: UtilsService,
    public iab: InAppBrowser,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public webService: WsService,
    public data: DataService,
    public date: DateService,
    public msAdal: MsAdalService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public firebaseAnalytics: FirebaseAnalyticsService,
  ) {
    this.firebaseAnalytics.createEvent('home_page', 'home');
    // tslint:disable-next-line: max-line-length
    this.getUserLocation();
    this.initLang();
    this.detectLangChange();
    this.showRgpdOneTime();
    this.initData();
  }



  /**
   *
   *
   * @memberof HomePage
   * init language , add listner for language changement
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

  detectLangChange() {
    this.events.language.subscribe((language) => {
      if (language !== undefined) {
        this.language = language;
      }
    });
  }

  /**
   *
   *
   * @memberof HomePage
   * navigate to page
   */
  goToInsctiption() {
    this.firebaseAnalytics.createEvent('coming', 'button');
    this.router.navigateByUrl('/inscription', { state: { registrations: this.Allregs, location: this.location } });
  }

  /**
   *
   *
   * @returns
   * @memberof HomePage
   * get User registrations
   */
  async getAllUserRegistration() {
    if (this.user === null || this.user === undefined) {
      return;
    }
    await this.webService.getUserRegistrations(this.user.id).toPromise()
      .then(async (arg: any) => {
        this.Allregs = arg;
        if (this.Allregs.length > 0) {
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < arg.length; index++) {
            await this.webService.getCrnForRegistration(this.Allregs[index].day_id, this.user.id).toPromise()
              .then((res: any) => {
                if (res.length > 0) {
                  this.Allregs[index].crnID = res[0].id;
                  this.Allregs[index].crnTime = res[0].creneau;
                  this.Allregs[index].id_creneau = res[0].id_creneau;
                } else {
                  this.Allregs[index].crnID = '';
                  this.Allregs[index].crnTime = '';
                  this.Allregs[index].id_creneau = '';
                }
              });
          }
        }
      });
  }


  /**
   *
   *
   * @memberof HomePage
   * init data and add listners
   */
  initData() {
    // check if user exist then get his regs
    this.storage.getObject('user').then((user) => {
      if (user !== undefined && user !== null) {
        this.user = user;
        this.name = this.user.firstname;
        this.getAllUserRegistration();
      }
    });

    // sync data when user is cnted
    this.events.user.subscribe(async (user) => {
      if (user !== undefined) {
        const loading = await this.loadingController.create({
          message: '',
          duration: 2000
        });
        await loading.present();
        this.user = user;
        this.name = this.data.getUser().firstname;
        this.getAllUserRegistration();
        this.loadingController.dismiss();
      }
    });

    // sync data when regisration added
    this.events.regisration.subscribe(async (data) => {
      if (data !== undefined) {
        const loading = await this.loadingController.create({
          message: this.translate.instant('PL_WAIT'),
          duration: 2000
        });
        await loading.present();
        this.getAllUserRegistration();
        this.loadingController.dismiss();
      }
    });

    // sync data when regisration deleted from page inscri
    this.events.deletedResa.subscribe(async (deletedResa) => {
      if (deletedResa !== undefined) {
        const loading = await this.loadingController.create({
          message: this.translate.instant('PL_WAIT'),
          duration: 2000
        });
        await loading.present();
        this.getAllUserRegistration();
        this.loadingController.dismiss();
      }
    });

    // sync location
    this.events.location.subscribe(async (location) => {
      if (location !== undefined) {
        this.location = location.nom;
      }
    });

  }

  /**
   *
   *
   * @memberof HomePage
   * check first time user is using application and show RGPD
   */
  showRgpdOneTime() {
    this.storage.getObject('firstTime').then(async (firstTime) => {
      if (firstTime !== undefined && firstTime !== null && firstTime !== '') {
        if (!firstTime) {
          this.showRGPD();
        }
      } else {
        this.showRGPD();
        this.storage.setObject('firstTime', true);
      }
    });
  }

  /**
   *
   *
   * @memberof HomePage
   * show first time alert RGPD
   */
  showRGPD() {
    let msg = '';
    this.storage.getObject('quota').then(async (quota) => {
      if (quota !== undefined && quota !== null && quota !== '') {
        if (this.language === 'fr') {
          msg = quota.intro_FR;
        }
        if (this.language === 'en') {
          msg = quota.intro_EN;
        }
        if (this.language === '') {
          msg = quota.intro_EN;
        }
        await this.showRGPDAlert(msg);
      } else {
        if (this.language === 'fr') {
          // tslint:disable-next-line: max-line-length
          msg = 'Vos données personnelles recueillies dans le cadre de l’utilisation de l’application font l’objet d’un traitement par BEL SA, en sa qualité de responsable de traitement, aux fins de mettre en œuvre les mesures visant à limiter la propagation du virus et d’assurer en toute sécurité la reprise de l’activité sur site. Vos données sont destinées à la Direction des Ressources Humaines et aux Services Généraux. Elles seront conservées pendant toute la durée nécessaire à la mise en place des mesures précitées. Vous bénéficiez d’un droit d’accès, de rectification et, le cas échéant, à l’effacement de vos données. Les droits précités peuvent être exercés à tout moment en vous adressant à dpm@groupe-bel.com.';
        }
        if (this.language === 'en') {
          // tslint:disable-next-line: max-line-length
          msg = 'Your personal data collected in the context of the use of the application are processed by BEL SA, in its capacity as data controller, for the purpose of implementing measures to limit the spread of the virus and to ensure the safe return to activity on site. Your data are intended for the Human Resources Department and General Services. They will be kept for the duration necessary to implement the above-mentioned measures. You have the right to access, rectify and, if necessary, delete your data. These rights may be exercised at any time by contacting dpm@groupe-bel.com.';
        }
        if (this.language === '') {
          // tslint:disable-next-line: max-line-length
          msg = 'Your personal data collected in the context of the use of the application are processed by BEL SA, in its capacity as data controller, for the purpose of implementing measures to limit the spread of the virus and to ensure the safe return to activity on site. Your data are intended for the Human Resources Department and General Services. They will be kept for the duration necessary to implement the above-mentioned measures. You have the right to access, rectify and, if necessary, delete your data. These rights may be exercised at any time by contacting dpm@groupe-bel.com.';
        }
        await this.showRGPDAlert(msg);
      }
    });

  }


  async showRGPDAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Bel come back!',
      message: msg,
      buttons: ['OK'],
      backdropDismiss: false,
      // cssClass: 'scaledAlert',
    });
    await alert.present();
  }


  /**
   *
   *
   * @param {*} resa
   * @memberof HomePage
   * navigate to booking modification page or user position page
   */
  async modifyResa(resa) {
    const today = moment(new Date()).format('YYYY-MM-DD');
    const resaDay = moment(resa.date).format('YYYY-MM-DD');
    if (today === resaDay) {
      // today resr
      this.firebaseAnalytics.createEvent('place_canteen', 'button');
      this.router.navigateByUrl('/user-place', { state: { reservation: resa } });
    } else {
      // not today resr
      await this.navigateModalModify(resa);
    }
  }

  async customModify(resa) {
    await this.navigateModalModify(resa);
  }

  /**
   *
   *
   * @param {*} resa
   * @memberof HomePage
   * open modification modal
   */
  async navigateModalModify(resa: any) {
    this.firebaseAnalytics.createEvent('modify_crn', 'button');
    const myModal = await this.modal.create({
      component: ModifyResaPage,
      // cssClass : 'classCss',
      showBackdrop: false,
      backdropDismiss: false,
      componentProps: {
        // here data to pass to modal
        reservation: resa
      }
    });
    await myModal.present();
    myModal.onWillDismiss().then((res) => {
      // this.menuCtrl.enable(true, 'myMenu');
      if (res.data !== null && res.data !== undefined && res.data === true) {
        this.getAllUserRegistration();
      }
    });
  }

  /**
   *
   *
   * @param {*} resa
   * @returns
   * @memberof HomePage
   * set icons for a reservation
   */
  changeIconResa(resa) {
    const today = moment(new Date()).format('YYYY-MM-DD');
    const resaDay = moment(resa.date).format('YYYY-MM-DD');
    if (today === resaDay) {
      return true;
    } else {
      return false;
    }
  }


  /**
   *
   *
   * @param {*} event
   * @memberof HomePage
   * refresh user registrations
   */
  doRefresh(event) {
    setTimeout(() => {
      this.getAllUserRegistration();
      event.target.complete();
    }, 2000);
  }
  /**
   *
   *
   * @memberof HomePage
   * navigate to page
   */
  openProfile() {
    this.firebaseAnalytics.createEvent('open_profile', 'button');
    this.router.navigateByUrl('/profil', { state: { showNavbar: true } });
  }
  /**
   *
   *
   * @memberof HomePage
   * set user location
   */
  async getUserLocation() {
    await this.storage.getObject('location').then(async (location) => {
      if (location !== undefined && location !== null && location !== '') {
        this.location = location.nom;
      }
    });
  }

}
