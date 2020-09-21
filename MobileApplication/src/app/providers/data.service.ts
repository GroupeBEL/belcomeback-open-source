import { StorageService } from './storage.service';
import { EventsService } from './events.service';
import { Injectable } from '@angular/core';

/**
 *
 *
 * @export
 * @class DataService
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  user = {
    id: null,
    firstname: '',
    lastname: '',
    email: '',
    num_badge: 0,
    token_notification: '',
    country: 0,
    location: 0,
    id_day: 0,
    date_creation: '',
    admin: 0
  };

  /**
   * Creates an instance of DataService.
   * @param {EventsService} events
   * @param {StorageService} storage
   * @memberof DataService
   */
  constructor(
    private events: EventsService,
    private storage: StorageService,
  ) {
    this.initUser();
  }

  /**
   *
   *
   * @param {*} user
   * @memberof DataService
   */
  setUser(user) {
    this.user = user;
    this.storage.setObject('user', user);
  }

  /**
   *
   *
   * @returns
   * @memberof DataService
   */
  getUser() {
    return this.user;
  }

  /**
   *
   *
   * @memberof DataService
   * Detect user changement
   */
  detectUserChanges() {
    this.events.user.subscribe((user) => {
      if (user !== undefined) {
        this.user = user;
        this.setUser(user);
      }
    });
  }

  /**
   *
   *
   * @memberof DataService
   * init user data
   */
  initUser() {
    this.storage.getObject('user').then((user) => {
      if (user !== undefined && user !== null && user !== '') {
        this.user = user;
      }
    });
  }
}
