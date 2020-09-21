import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256';
import * as moment from 'moment';

/**
 *
 *
 * @export
 * @class UtilsService
 */
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  /**
   * Creates an instance of UtilsService.
   * @param {TranslateService} trs
   * @memberof UtilsService
   */
  constructor(
    public trs: TranslateService
  ) { }


  /**
   *
   *
   * @param {boolean} first
   * @param {string} fullName
   * @returns
   * @memberof UtilsService
   * get First or last name
   */
  getFirstOrLastName(first: boolean, fullName: string) {
    if (first) {
      return fullName.substr(0, fullName.indexOf(' '));
    } else {
      return fullName.substr(fullName.indexOf(' ') + 1);
    }
  }

  /**
   *
   *
   * @param {*} obj1
   * @param {*} obj2
   * @returns
   * @memberof UtilsService
   * compare two objects
   */
  compareJsonObjects(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   *
   *
   * @param {string} strings
   * @param {string} substring
   * @returns
   * @memberof UtilsService
   * find string in another
   */
  findString(strings: string, substring: string) {
    return strings.indexOf(substring) !== -1; // true found
  }

  /**
   *
   *
   * @param {number} val1
   * @param {number} val2
   * @returns
   * @memberof UtilsService
   * get Diff between two numbers
   */
  getDiffValues(val1: number, val2: number) {
    if (val1 === null || val1 === undefined) {
      val1 = 0;
    }
    if (val2 === null || val2 === undefined) {
      val2 = 0;
    }
    if (val1 >= val2) {
      return val1 - val2;
    } else {
      return 0;
    }
  }

  /**
   *
   *
   * @param {string} data
   * @returns
   * @memberof UtilsService
   * encrypt user
   */
  encryptUser(data: string) {
    const newData = data.toLowerCase();
    const today = moment(new Date()).format('YYYY-MM-DD');
    const toEnc = newData + 'S3l' + today;
    return sha256(toEnc);
  }

  /**
   *
   *
   * @param {string} str
   * @param {number} startIndex
   * @param {number} endIndex
   * @returns
   * @memberof UtilsService
   * get custom string
   */
  getCustomString(str: string, startIndex: number, endIndex: number) {
    return str.substring(startIndex, endIndex);
  }

  /**
   *
   *
   * @param {*} language
   * @memberof UtilsService
   * change App language
   */
  useLanguage(language) {
    this.trs.use(language);
  }

}
