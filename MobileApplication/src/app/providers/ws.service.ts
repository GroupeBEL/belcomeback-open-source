import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class WsService {
  // Put your url here
  prodUrl = 'YouUrl/api/api.php/';
  webProd = 'YouUrl/ws/';

  constructor(public http: HttpClient) { }

  /**
   *
   *
   * @return {*}  {*}
   * @memberof WsService
   */
  getHeadersWithToken(): any {
    return '?token=' + this.generateToken();
  }

  /**
   *
   *
   * @return {*}  {*}
   * @memberof WsService
   */
  getTokenWithAnd(): any {
    return '&token=' + this.generateToken();
  }


  /**
   *
   *
   * @return {*}
   * @memberof WsService
   */
  generateToken() {
    const token = 'tokendeouf' + moment().format('DD/MM/YYYY');
    const tokenCrypted = Md5.hashStr(token);
    return tokenCrypted;
  }

  /**
   *
   *
   * @param {*} firstName
   * @param {*} lastName
   * @param {*} mail
   * @return {*}
   * @memberof WsService
   */
  createNewUser(firstName, lastName, mail) {
    const postData = {
      firstname: firstName,
      lastname: lastName,
      email: mail,
      admin: 0,
      location: 1
    };
    return this.http.post(this.prodUrl + 'user' + this.getHeadersWithToken(), postData);
  }

  /**
   *
   *
   * @param {*} userID
   * @param {*} firstName
   * @param {*} lastName
   * @return {*}
   * @memberof WsService
   */
  UpdateUserByFNAndLN(userID, firstName, lastName) {
    const putData = {
      firstname: firstName,
      lastname: lastName
    };
    return this.http.put(this.prodUrl + 'user/' + userID + this.getHeadersWithToken(), putData);
  }

  /**
   *
   *
   * @param {*} userID
   * @param {*} locality
   * @return {*}
   * @memberof WsService
   */
  UpdateUserLocality(userID, locality) {
    const putData = {
      location: locality
    };
    return this.http.put(this.prodUrl + 'user/' + userID + this.getHeadersWithToken(), putData);
  }


  /**
   *
   *
   * @param {*} id
   * @return {*}
   * @memberof WsService
   */
  getUserByID(id) {
    return this.http.get(this.prodUrl + 'user/' + id + this.getHeadersWithToken());
  }

  /**
   *
   *
   * @param {*} email
   * @return {*}
   * @memberof WsService
   */
  getUserByEmail(email) {
    return this.http.get(this.prodUrl + 'user?transform=true&filter%5B%5D=email%2Ceq%2C' + email + this.getTokenWithAnd());
  }

  /**
   *
   *
   * @param {*} idCren
   * @param {*} day
   * @param {*} location
   * @return {*}
   * @memberof WsService
   */
  getNbRegisterCrnByDay(idCren, day, location) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.webProd + 'get_nb_register_by_day_loc_timeslot.php?creneau=' + idCren + '&location=' + location + '&day=' + day + '&token=' + this.generateToken());
  }


  /**
   *
   *
   * @param {*} location
   * @return {*}
   * @memberof WsService
   */
  getCrn(location) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.prodUrl + 'canteen_timeslots?order=creneau%2Casc&transform=true&filter%5B%5D=status%2Ceq%2C1&filter%5B%5D=location_id%2Ceq%2C' + location + this.getTokenWithAnd());
  }

  /**
   *
   *
   * @param {*} dayID
   * @return {*}
   * @memberof WsService
   */
  getCrnForDay(dayID) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.webProd + 'get_day_free_timeslots.php?day_id=' + dayID + '&token=' + this.generateToken());
  }

  /**
   *
   *
   * @param {*} dayID
   * @return {*}
   * @memberof WsService
   */
  getParkingDispoForDay(dayID) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.webProd + 'get_day_free_parking_places.php?day_id=' + dayID + '&token=' + this.generateToken());
  }

  /**
   *
   *
   * @param {*} dayID
   * @param {*} userID
   * @return {*}
   * @memberof WsService
   */
  getCrnForRegistration(dayID, userID) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.webProd + 'get_day_user_free_timeslots.php?day_id=' + dayID + '&user_id=' + userID + '&token=' + this.generateToken());
  }

  /**
   *
   *
   * @param {*} userID
   * @param {*} crnID
   * @param {*} dayID
   * @return {*}
   * @memberof WsService
   */
  addUserCrn(userID, crnID, dayID) {
    const crn = {
      user_id: userID,
      timeslot_id: crnID,
      day_id: dayID
    };
    return this.http.post(this.prodUrl + 'canteen_registration' + this.getHeadersWithToken(), crn);

  }
  /**
   *
   *
   * @param {*} userID
   * @param {*} dayID
   * @return {*}
   * @memberof WsService
   */
  getUserCrn(userID, dayID) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.prodUrl + 'canteen_registration?transform=true&filter%5B%5D=user_id%2Ceq%2C' + userID + '&filter%5B%5D=day_id%2Ceq%2C' + dayID + this.getTokenWithAnd());
  }

  /**
   *
   *
   * @param {*} CrnID
   * @param {*} userID
   * @param {*} dayID
   * @param {*} crn
   * @return {*}
   * @memberof WsService
   */
  updateUserCrn(CrnID, userID, dayID, crn) {
    const putData = {
      user_id: userID,
      timeslot_id: crn,
      day_id: dayID

    };
    return this.http.put(this.prodUrl + 'canteen_registration/' + CrnID + this.getHeadersWithToken(), putData);
  }

  /**
   *
   *
   * @param {*} idCtn
   * @return {*}
   * @memberof WsService
   */
  deleteUserCrn(idCtn) {
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.prodUrl + 'canteen_registration/' + idCtn + this.getHeadersWithToken());
  }

  /**
   *
   *
   * @param {*} userID
   * @param {*} dayID
   * @param {*} day
   * @param {*} park
   * @param {*} localtion
   * @return {*}
   * @memberof WsService
   */
  addUserRegistration(userID, dayID, day, park, localtion) {
    const reg = {
      user_id: userID,
      day_id: dayID,
      arrival_date: day,
      departure_date: day,
      status: 1,
      location_id: localtion,
      parking: park
    };
    return this.http.post(this.prodUrl + 'register' + this.getHeadersWithToken(), reg);
  }

  /**
   *
   *
   * @param {*} userID
   * @param {*} dayID
   * @return {*}
   * @memberof WsService
   */
  getUserRegisrationByDayID(userID, dayID) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.prodUrl + 'register?transform=true&filter%5B%5D=user_id%2Ceq%2C' + userID + '&filter%5B%5D=day_id%2Ceq%2C' + dayID + this.getTokenWithAnd());
  }

  /**
   *
   *
   * @param {*} idReg
   * @return {*}
   * @memberof WsService
   */
  deleteRegistration(idReg) {
    return this.http.delete(this.prodUrl + 'register/' + idReg + this.getHeadersWithToken());
  }

  /**
   *
   *
   * @param {*} idReg
   * @param {*} park
   * @return {*}
   * @memberof WsService
   */
  updateParkingRegistration(idReg, park) {
    const putData = {
      parking: park
    };
    return this.http.put(this.prodUrl + 'register/' + idReg + this.getHeadersWithToken(), putData);
  }

  /**
   *
   *
   * @param {*} userID
   * @return {*}
   * @memberof WsService
   */
  getUserRegistrations(userID) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.webProd + 'get_user_registrations.php?user_id=' + userID + '&token=' + this.generateToken());
  }


  /**
   *
   *
   * @param {*} location
   * @return {*}
   * @memberof WsService
   */
  getQuota(location) {
    return this.http.get(this.prodUrl + 'quota?transform=true&filter%5B%5D=id_location%2Ceq%2C' + location + this.getTokenWithAnd());
  }

  /**
   *
   *
   * @param {*} userID
   * @return {*}
   * @memberof WsService
   */
  getUserPlanning(userID) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.webProd + 'get_user_planning.php?user_id=' + userID + this.getTokenWithAnd());
  }

  /**
   *
   *
   * @param {*} locality
   * @return {*}
   * @memberof WsService
   */
  getPlacesByLocality(locality) {
    return this.http.get(this.prodUrl + 'area?transform=true&filter%5B%5D=location_id%2Ceq%2C' + locality + this.getTokenWithAnd());
  }

  /**
   *
   *
   * @param {*} lieu
   * @return {*}
   * @memberof WsService
   */
  getNbrPeopleInPlace(lieu) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.webProd + 'get_number_button.php?id=' + lieu);

  }

  /**
   *
   *
   * @return {*}
   * @memberof WsService
   */
  getLocalities() {
    return this.http.get(this.prodUrl + 'location?transform=true' + this.getTokenWithAnd());
  }

  /**
   *
   *
   * @param {*} localtionID
   * @return {*}
   * @memberof WsService
   */
  getLocalityByID(localtionID) {
    return this.http.get(this.prodUrl + 'location/' + localtionID + this.getHeadersWithToken());
  }

  /**
   *
   *
   * @param {*} idLocation
   * @return {*}
   * @memberof WsService
   */
  goInLocation(idLocation) {
    return this.http.get(this.webProd + 'flash_in.php?id=' + idLocation);
  }

  /**
   *
   *
   * @param {*} idLocation
   * @return {*}
   * @memberof WsService
   */
  goOutLocation(idLocation) {
    return this.http.get(this.webProd + 'flash_out.php?id=' + idLocation);
  }

}

