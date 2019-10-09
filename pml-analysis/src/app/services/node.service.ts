import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { END_POINT, API_VERSION } from '../config/env';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  /**
   * Crea una instancia de servicio para nodos.
   * @param {HttpClient} _httpClient Cliente HTTP
   * @memberof NodeService
   */
  constructor(private _httpClient: HttpClient) { }

  /**
   * Obtiene todos los nodos
   *
   * @returns Arreglo de nodos
   * @memberof NodeService
   */
  getAllNodes() {
    const url = `${END_POINT}/api/v1/nodes`;

    return this._httpClient.get(url)
      .pipe(map( (resolve: any, reject) => {
        return resolve;
      }));
  }
}
