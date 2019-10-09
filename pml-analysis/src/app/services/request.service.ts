import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { END_POINT, API_VERSION } from '../config/env';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  /**
   * Crea una instancia para obtener los parámetros de la peticion
   * @param _httpClient Cliente HTTP
   */
  constructor(private _httpClient: HttpClient) { }

  getRequestDate(data: any) {
    const url = `${END_POINT}/api/v1/validateRequest`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this._httpClient.post(url, data, { headers: headers }).pipe(map( (resolve: any, reject) => {
      return resolve;
    })).toPromise();
  }

  /**
   * Crea una instancia para obtener los parámetros de la petición sin validar si existen o no
   * @param {*} data
   */
  prepareRequest(data: any) {
    const url = `${END_POINT}/api/v1/prepareRequest`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this._httpClient.post(url, data, { headers: headers }).pipe(map( (resolve: any, reject) => {
      return resolve;
    })).toPromise();
  }
}
