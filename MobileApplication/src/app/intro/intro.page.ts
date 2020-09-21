import { MsalService } from '@azure/msal-angular';
import { MsAdalService } from './../providers/ms-adal.service';
import { EventsService } from './../providers/events.service';
import { UtilsService } from './../providers/utils.service';
import { WsService } from './../providers/ws.service';
import { StorageService } from './../providers/storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { flatMap } from 'rxjs/operators';

/**
 *
 *
 * @export
 * @class IntroPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  /**
   * Creates an instance of IntroPage.
   * @param {WsService} restService
   * @param {EventsService} events
   * @param {Router} router
   * @param {MsAdalService} msAdal
   * @param {UtilsService} utils
   * @param {MsalService} auth
   * @param {WsService} webService
   * @param {StorageService} storage
   * @memberof IntroPage
   */
  constructor(
    private restService: WsService,
    private events: EventsService,
    private router: Router,
    private msAdal: MsAdalService,
    private utils: UtilsService,
    public auth: MsalService,
    private webService: WsService,
    private storage: StorageService


  ) { }

  ngOnInit() {
  }

  /**
   *
   *
   * @returns
   * @memberof IntroPage
   * login user after beign logout
   */
  async login() {
    // login and init data user:
    await this.loginMsal();

    const firstName = this.utils.getFirstOrLastName(true, this.auth.getAccount().name);
    const lastName = this.utils.getFirstOrLastName(false, this.auth.getAccount().name);
    const email = this.utils.getFirstOrLastName(false, this.auth.getAccount().userName);

    if (email === null || email === undefined || email === '') {
      return;
    }

    this.restService.getUserByEmail(email).subscribe((data: any) => {

      if (data.user.length > 0) {
        // user found --> save user
        this.getUserQuota(data.user[0].location);
        this.events.user.next(data.user[0]);
        this.router.navigateByUrl('/home', { state: { intro: true } });
      } else {
        // user not found DB --> create save user
        this.restService.createNewUser(firstName, lastName, email).pipe(
          flatMap(userID => this.restService.getUserByID(userID))
        ).subscribe((user: any) => {
          this.getUserQuota(user.location);
          this.events.user.next(user);
          this.router.navigateByUrl('/profil', { state: { showNavbar: false } });
        }, err => {
          console.log('createNewUser ' + JSON.stringify(err));
        });
      }
    }, err => {
      console.log('getUserEmail ' + JSON.stringify(err));
    });

  }

  /**
   *
   *
   * @memberof IntroPage
   * login azure
   */
  async loginMsal() {
    this.msAdal.login();
  }

  /**
   *
   *
   * @param {*} location
   * @memberof IntroPage
   * get quota
   */
  async getUserQuota(location) {
    await this.webService.getQuota(location).toPromise().then((arg: any) => {
      this.storage.setObject('quota', arg.quota[0]);
    });
  }


}
