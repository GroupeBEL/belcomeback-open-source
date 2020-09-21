import { UtilsService } from './../providers/utils.service';
import { EventsService } from './../providers/events.service';
import { StorageService } from './../providers/storage.service';
import { DateService } from './../providers/date.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

/**
 *
 *
 * @export
 * @class ConfirmedPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.page.html',
  styleUrls: ['./confirmed.page.scss'],
})
export class ConfirmedPage implements OnInit {
  language = '';
  data: any;
  time = '';
  contactInf = '';
  contactSg = '';

  /**
   * Creates an instance of ConfirmedPage.
   * @param {Router} router
   * @param {DateService} date
   * @param {StorageService} storage
   * @param {ModalController} modal
   * @param {EventsService} events
   * @param {UtilsService} utils
   * @memberof ConfirmedPage
   */
  constructor(
    public router: Router,
    public date: DateService,
    public storage: StorageService,
    public modal: ModalController,
    public events: EventsService,
    public utils: UtilsService
  ) {
    this.data = this.router.getCurrentNavigation().extras.state.data;
    this.time = this.data.passHour;
    this.initData();
  }

  ngOnInit() {
  }


  /**
   *
   *
   * @memberof ConfirmedPage
   * init page data
   */
  async initData() {
    // Set the default language for translation strings.
    await this.storage.getItem('language').then((language) => {
      if (language !== undefined && language !== null && language !== '') {
        this.language = language;
      } else {
        this.language = 'en';
      }
    });
    await this.storage.getObject('quota').then((quota) => {
      if (quota !== undefined && quota !== null && quota !== '') {
        this.contactInf = quota.contactInfirmerie;
        this.contactSg = quota.ContactSG;
      }
    });
  }

  /**
   *
   *
   * @memberof ConfirmedPage
   * navigate to page
   */
  async openGbr() {
    this.router.navigateByUrl('/protection');
  }

  /**
   *
   *
   * @param {*} choice
   * @memberof ConfirmedPage
   * conditional navigate page
   */
  choiceFinal(choice) {
    if (choice) {
      this.events.regisration.next(true);
      this.router.navigateByUrl('/home', { state: { intro: false } });
    } else {
      this.openGbr();
    }
  }

}
