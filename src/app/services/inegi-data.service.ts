import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { END_POINT, API_VERSION } from '../config/env';

@Injectable({
  providedIn: 'root'
})
export class InegiDataService {
  /**
   * Crea una instancia de servicio para nodos.
   * @param {HttpClient} _httpClient Cliente HTTP
   * @memberof NodeService
   */
  constructor(private _httpClient: HttpClient) { }

  getAllStates() {
    const url = `${END_POINT}/api/v1/inegi/estados`;

    return this._httpClient.get(url)
      .pipe(map( (resolve: any, reject) => {
        return resolve;
      }));
  }

  getTownsByState(stateId: number) {
    const url = `${END_POINT}/api/v1/inegi/estados/${ stateId }/municipios`;

    return this._httpClient.get(url)
      .pipe(map( (resolve: any, reject) => {
        return resolve;
      }));
  }
}
