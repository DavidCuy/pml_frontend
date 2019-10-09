import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { END_POINT, API_VERSION } from '../config/env';

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {

  constructor(private _httpClient: HttpClient) { }

  getErrorLog(beginDate: string, endDate: string) {
    const url = `${END_POINT}/api/v1/errorLog/beginDate/${beginDate}/endDate/${endDate}`;

    return this._httpClient.get(url)
      .pipe(map( (resolve: any, reject) => {
        return resolve;
      }));
  }
}
