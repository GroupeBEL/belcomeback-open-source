import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

/**
 *
 *
 * @export
 * @class StorageService
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Creates an instance of StorageService.  Can be adapted to Storage with capacitor later
   * @param {TranslateService} translate
   * @param {Storage} storage
   * @memberof StorageService
   */
  constructor(
    public translate: TranslateService,
    public storage: Storage
  ) { }

  /**
   *
   *
   * @param {*} ky
   * @param {*} obj
   * @memberof StorageService
   * JSON "set" example
   */
  async setObject(ky, obj) {
    await  this.storage.set(ky, obj);
  }

  /**
   *
   *
   * @param {*} ky
   * @returns
   * @memberof StorageService
   * JSON "get" example
   */
  async getObject(ky) {
    const ret = await this.storage.get(ky);
    return ret;
  }

  /**
   *
   *
   * @param {*} ky
   * @param {*} val
   * @memberof StorageService
   * JSON "get" example
   */
  async setItem(ky, val) {
    await this.storage.set(ky, val);
  }

  /**
   *
   *
   * @param {*} ky
   * @returns
   * @memberof StorageService
   */
  async getItem(ky) {
    const ret = await this.storage.get(ky);
    return ret;
  }

  /**
   *
   *
   * @param {*} ky
   * @memberof StorageService
   * remove item
   */
  async removeItem(ky) {
    await this.storage.remove(ky);
  }



  /**
   *
   *
   * @memberof StorageService
   * clear storage
   */
  async clear() {
    await this.storage.clear();
  }

  /**
   *
   *
   * @param {*} lang
   * @param {boolean} save
   * @memberof StorageService
   * change App language and save in storage
   */
  useLanguage(lang, save: boolean) {
    if (save) {
      this.setItem('language', lang);
    }
    this.translate.use(lang);
  }
}
