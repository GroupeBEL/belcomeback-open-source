import { FirebaseAnalyticsService } from './../providers/firebase-analytics.service';
import { StorageService } from './../providers/storage.service';
import { DateService } from './../providers/date.service';
import { WsService } from './../providers/ws.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

/**
 *
 *
 * @export
 * @class CantinePage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-cantine',
  templateUrl: './cantine.page.html',
  styleUrls: ['./cantine.page.scss'],
})
export class CantinePage implements OnInit {
  form: FormGroup;
  noCantine = 0;
  subs = 0;
  cantine = false;
  cantineShow = 0;
  totalplaces = 0;
  crns = [];
  subsDays = [];
  planning: any;
  language = '';
  location = '';
  data = {
    cantine: false,
    passHour: '',
    cantineID: 0,
    parking: false
  };
  /**
   * Creates an instance of CantinePage.
   * @param {Router} router
   * @param {WsService} webService
   * @param {DateService} date
   * @param {StorageService} storage
   * @param {FormBuilder} formBuilder
   * @param {FirebaseAnalyticsService} firebaseAnalytics
   * @memberof CantinePage
   */
  constructor(
    public router: Router,
    public webService: WsService,
    public date: DateService,
    public storage: StorageService,
    public formBuilder: FormBuilder,
    public firebaseAnalytics: FirebaseAnalyticsService
  ) {
    this.firebaseAnalytics.createEvent('rie_page', 'RIE');
    this.initForm();
    this.initLang();
    this.location = this.router.getCurrentNavigation().extras.state.location;
    this.planning = this.router.getCurrentNavigation().extras.state.planning;
    this.data.parking = this.router.getCurrentNavigation().extras.state.parking.parking;
    this.getCreneaux();
  }

  ngOnInit() {
  }


  /**
   *
   *
   * @memberof CantinePage
   * init cantine form
   */
  initForm() {
    this.form = this.formBuilder.group({
      canteen: [null, Validators.required]
    });
  }

  /**
   *
   *
   * @memberof CantinePage
   * navigate to page
   */
  goToRecap() {
    this.firebaseAnalytics.createEvent('rie_page_next', 'button');
    // tslint:disable-next-line: max-line-length
    this.router.navigateByUrl('/recap', { state: { cantine: this.data, planning: this.planning, language: this.language, location: this.location } });
  }

  /**
   *
   *
   * @memberof CantinePage
   * get value selected
   */
  changeTime() {
    this.getCreTime(this.form.get('canteen').value);
  }



  /**
   *
   *
   * @memberof CantinePage
   * get slots available for a locality
   */
  getCreneaux() {
    this.storage.getObject('user').then((user) => {
      if (user !== undefined && user !== null) {
        this.webService.getCrn(user.location)
          .subscribe((arg: any) => {
            this.crns = arg.creneaux_cantine;
          }, err => {
            console.log('getCrn' + JSON.stringify(err));
          });
      }
    });
  }

  getFormData() {

  }

  /**
   *
   *
   * @param {*} id
   * @memberof CantinePage
   * get slots for a selected time
   */
  getCreTime(id) {
    // tslint:disable-next-line: radix
    id = parseInt(id);
    this.data.cantineID = id;
    if (id !== 0) {
      this.data.cantine = true;
    } else {
      this.data.passHour = '';
      this.data.cantine = false;
    }
    if (this.crns.length > 0 && id !== 0) {
      this.setData(id);
    }

  }


  /**
   *
   *
   * @param {*} id
   * @memberof CantinePage
   * change planning array data and add user subs object
   */
  setData(id: any) {
    this.subsDays = [];
    this.storage.getObject('user').then(async (user) => {
      if (user !== undefined && user !== null) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < this.crns.length; index++) {
          const element = this.crns[index];
          if (element.id === id) {
            this.totalplaces = element.nb_places;
            this.data.passHour = element.creneau;
            for (let i = 0; index < this.planning.length; i++) {
              const crnSubs = {
                day: '',
                subs: 0
              };
              if (this.planning[i].checked && !this.planning[i].reserved) {
                if (this.planning[i].nbrFreePlacesCantine > 0) {
                  // tslint:disable-next-line: max-line-length
                  await this.webService.getNbRegisterCrnByDay(id, this.date.getDateCustomFormatted(this.planning[i].day, 'YYYY-MM-DD'), user.location).toPromise()
                    .then((nbr: any) => {
                      crnSubs.day = this.date.getCustomDateFormatted(this.language, this.planning[i].day, 'ddd DD MMMM');
                      // tslint:disable-next-line: radix
                      crnSubs.subs = this.totalplaces > parseInt(nbr) ? this.totalplaces - parseInt(nbr) : 0;
                      // tslint:disable-next-line: radix
                      this.planning[i].subs = this.totalplaces > parseInt(nbr) ? this.totalplaces - parseInt(nbr) : 0;
                      this.subsDays.push(crnSubs);
                    });
                } else {
                  crnSubs.day = this.date.getCustomDateFormatted(this.language, this.planning[i].day, 'ddd DD MMMM');
                  crnSubs.subs = 0;
                  this.planning[i].subs = 0;
                  this.subsDays.push(crnSubs);
                }

              }

            }
          }
        }
      }
    });

  }

  /**
   *
   *
   * @memberof CantinePage
   *  init language
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

}
