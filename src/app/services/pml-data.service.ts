import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { END_POINT } from '../config/env';
import { map } from 'rxjs/operators';
import { PMLData } from '../models/pml-data.model';
import { NodeMData } from '../models/nodeM.model';

@Injectable({
  providedIn: 'root'
})
export class PmlDataService {

  constructor(private _httpClient: HttpClient) { }

  makePMLrequest(data: any): Promise<any> {
    const url = `${END_POINT}/api/v1/pmlRequest`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this._httpClient.post(url, data, { headers: headers }).toPromise();
  }

  getStorageData() {
    const url = `${END_POINT}/api/v1/getStorageData`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this._httpClient.get(url, { headers: headers }).pipe(
      map( (resolve: any, reject) => {
        return resolve;
    }));
  }

  getNodeData(query: any) {
    const url = `${END_POINT}/api/v1/getDataQuery`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    console.log(query);
    return this._httpClient.post(url, query, { headers: headers }).pipe(
      map( (resolve: any, reject) => {
      const pml_data: PMLData[] = resolve.map(data => {
        return {
          _id: '',
          area: data.area,
          clave: data.clave,
          fecha: new Date(Date.parse(data.fecha)),
          hora: parseInt(data.hora, 10),
          nombre: data.nombre,
          pml: parseFloat(data.pml),
          pml_cng: parseFloat(data.pml_cng),
          pml_ene: parseFloat(data.pml_ene),
          pml_per: parseFloat(data.pml_per),
          proceso: data.proceso,
          sistema: data.sistema
        };
      });
      return pml_data;
    }));
  }

  getNodeM(query: any) {
    const url = `${END_POINT}/api/v1/nodosM`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this._httpClient.post(url, query, { headers: headers }).pipe(
      map( (resolve: any, reject) => {
      const pml_data: NodeMData[] = resolve.map(data => {
        return {
          datetime: new Date(Date.parse(data.datetime)),
          fecha: data.fecha,
          hora: parseInt(data.hora, 10),
          pml: parseFloat(data.pml),
          pml_cng: parseFloat(data.pml_cng),
          pml_ene: parseFloat(data.pml_ene),
          pml_per: parseFloat(data.pml_per)
        };
      });
      return pml_data;
    }));
  }
}
