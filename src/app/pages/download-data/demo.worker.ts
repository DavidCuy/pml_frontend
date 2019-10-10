import { DoWork, ObservableWorker } from 'observable-webworker';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

@ObservableWorker()
export class DemoWorker implements DoWork<string, string> {

  public work(input$: Observable<any>): Observable<any> {
    return input$.pipe(
      // tslint:disable-next-line:no-shadowed-variable
      map(data => {
        // tslint:disable-next-line:prefer-const
        let pml_resp: any[] = [];
        data.forEach(req => {
          const resp = this.makeRequest(req);
          pml_resp.push(resp);
        });
        return pml_resp;
      })
    );
  }

  public makeRequest(data) {
    console.log('makerRequ', data);
    return ajax({
      url: 'http://localhost:5000/api/v1/pmlRequest',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      async: false,
      body: data,
    }).pipe(
      map(response => {
        console.log({
          msg: 'si lo hizo bien',
          data: response
        });
        return response;
      }),
      error => {
        console.error('error: ', error);
        return of(error);
      }).toPromise();
  }

}

