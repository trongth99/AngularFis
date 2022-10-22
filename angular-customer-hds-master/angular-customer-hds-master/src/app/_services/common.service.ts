import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

//const baseApiURL = 'http://localhost:8080/apiCustomer/';
//const baseApiAuthURL = 'http://localhost:8082/authenticationService/';

// const baseApiURL = 'http://103.9.0.210/apiCustomer/';
// const baseApiAuthURL = 'http://103.9.0.210/authenticationService/';

const baseApiURL = environment.baseApiURL;
const baseApiAuthURL = environment.baseApiAuthURL;

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  base_api_url = '';

  constructor(private httpClient: HttpClient) { }

  curlData(mod: string, data: any, authorization='', method='post', serv='default'): Observable<any> {
    if (!serv || serv == 'default') {
      this.base_api_url = baseApiURL;
    } else if (serv == 'auth') {
      this.base_api_url = baseApiAuthURL;
    }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let token = '444ab0ea-7862-40bf-b1dc-32f176ed2475';
    let code = 'hds';

    headers = headers.set('token', token).set('code', code);
    if (authorization) {
      headers = headers.set('Authorization', authorization);
    }

    if (method == 'post') {
      return this.httpClient.post(this.base_api_url + mod, data, { headers });
    } else if (method == 'put') {
      return this.httpClient.put(this.base_api_url + mod, data, { headers });
    } else if (method == 'delete') {
      return this.httpClient.delete(this.base_api_url + mod, data);
    } else {
      return this.httpClient.get(this.base_api_url + mod, { headers });
    }
  }
}
