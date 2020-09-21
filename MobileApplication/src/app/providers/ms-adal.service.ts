import { UtilsService } from './utils.service';
import { AlertService } from './alert.service';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { CryptoUtils, Logger } from 'msal';


/**
 *
 *
 * @export
 * @class MsAdalService Auth azure (works only on browser,mobile version msadal : github.com/GroupeBEL/azure-activedirectory-library-for-cordova)
 */
@Injectable({
  providedIn: 'root'
})
export class MsAdalService {
  isIframe = false;
  loggedIn = false;

  /**
   * Creates an instance of MsAdalService.
   * @param {BroadcastService} broadcastService
   * @param {MsalService} authService
   * @param {AlertService} alert
   * @param {ToastController} toastCtr
   * @param {UtilsService} utils
   * @memberof MsAdalService
   */
  constructor(
    private broadcastService: BroadcastService,
    private authService: MsalService,
    private alert: AlertService,
    private toastCtr: ToastController,
    private utils: UtilsService) { }

  /**
   *
   *
   * @memberof MsAdalService
   * init connexion
   */
  init() {
    this.isIframe = window !== window.parent && !window.opener;

    this.checkoutAccount();

    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkoutAccount();
    });

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      // console.log('Redirect Success: ', response);
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      // console.log('MSAL Logging: ', message);
      if (this.utils.findString(message, 'Error when acquiring token for scopes')) {
        this.alert.openToast(this.toastCtr, 'Session expired!', 'bottom', 3000);
        this.authService.loginRedirect();
      }
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));
  }

  /**
   *
   *
   * @memberof MsAdalService
   * check if user is connected
   */
  checkoutAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }

  /**
   *
   *
   * @memberof MsAdalService
   * login
   */
  login() {
    // const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    if (!this.loggedIn) {
      this.authService.loginRedirect();
      // Check for IE, ie is no longer supported by microsoft (reason commenting this method)
      /*if (isIE) {
        this.authService.loginRedirect();
      } else {
        this.authService.loginPopup();
      }*/
    } else {
      // console.log('user connected already');
      // this.authService.acquiretokenRedirect();
    }

  }

  /**
   *
   *
   * @memberof MsAdalService
   * logout
   */
  logout() {
    this.authService.logout();
  }


}
