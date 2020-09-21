import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 *
 *
 * @export
 * @class EventsService
 * class contains events
 */
@Injectable({
  providedIn: 'root'
})
export class EventsService {
  // used in application to check status of some data , this replaces the old events in ionic 3
  language: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  user: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  regisration: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  navDataIos: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  deletedResa: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  location: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  constructor() { }
}
