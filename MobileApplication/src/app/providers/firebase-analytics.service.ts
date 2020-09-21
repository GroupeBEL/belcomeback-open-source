import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

/**
 *
 *
 * @export
 * @class FirebaseAnalyticsService
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseAnalyticsService {

  constructor() { }

  /**
   *
   *
   * @param {string} eveName
   * @param {string} PageName
   * @memberof FirebaseAnalyticsService
   * create custom firebase event
   */
  createEvent(eveName: string, PageName: string) {
    firebase.analytics().logEvent(eveName, { page: PageName });
  }

}
