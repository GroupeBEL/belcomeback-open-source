import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/en-gb';

/**
 *
 *
 * @export
 * @class DateService
 */
@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  /**
   *
   *
   * @param {string} lang
   * @returns
   * @memberof DateService
   * format date to specific language
   */
  getDateFormatted(lang: string) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    if (lang === 'fr') {
      moment.locale('fr');
    } else {
      moment.locale('en-gb');
    }
    return moment(date).format('dddd DD MMMM');
  }

  /**
   *
   *
   * @param {string} lang
   * @param {*} date
   * @param {string} format
   * @returns
   * @memberof DateService
   * custom format date to specific language
   */
  getCustomDateFormatted(lang: string, date, format: string) {
    if (lang === 'fr') {
      moment.locale('fr');
    } else {
      moment.locale('en-gb');
    }
    return moment(date).format(format);
  }

  /**
   *
   *
   * @param {string} format
   * @returns
   * @memberof DateService
   * custom format new Date() + 1
   */
  getDateTommorowFormatted(format: string) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tmrdate = moment(date).format(format);
    return tmrdate;
  }

  /**
   *
   *
   * @param {string} format
   * @returns
   * @memberof DateService
   * custom format new Date ()
   */
  getDateTadayFormatted(format: string) {
    const date = new Date();
    const tmrdate = moment(date).format(format);
    return tmrdate;
  }

  /**
   *
   *
   * @param {*} day
   * @param {string} format
   * @returns
   * @memberof DateService
   * custom format day
   */
  getDateCustomFormatted(day: any, format: string) {
    return moment(day).format(format);
  }

  /**
   *
   *
   * @param {*} date
   * @returns
   * @memberof DateService
   * format date
   */
  formatDate(date) {
    return moment(date).format('DD MMM YYYY');
  }


  /**
   *
   *
   * @param {*} from
   * @param {*} to
   * @returns
   * @memberof DateService
   * count number of days between two days (moment)
   */
  daysBetween(from, to) {
    const fromDate = moment(from).startOf('day');
    const toDate = moment(to).endOf('day');

    const span = moment.duration(toDate.diff(fromDate)).asDays();
    const days = [];
    for (let i = 0; i <= span; i++) {
      days.push(moment(fromDate).add(i, 'day').startOf('day'));
    }
    return days;
  }

  // normal method
  /**
   *
   *
   * @param {*} currentDate
   * @returns
   * @memberof DateService
   * get the new date () + 1
   */
  addDays(currentDate) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    return date;
  }

  /**
   *
   *
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns
   * @memberof DateService
   * count number of days between two days
   */
  getDaysBetween(startDate: Date, endDate: Date) {
    const dates = [];
    let currentDate: Date = startDate;
    while (currentDate <= endDate) {
      // avoid weekend days
      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
        dates.push(currentDate);
      }
      currentDate = this.addDays(currentDate);
    }

    return dates;
  }

}
