import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Setting {

  constructor(public http: Http, @Inject('API_URL') private url: string) {

  }

  saveDeviceToken(token: string, deviceToken) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      let body = { deviceToken: deviceToken };

      this.http.post(`${this.url}/fcm/register-device`, body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  getAcceptStatus(token: string) {
    console.log(token);
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      // console.log(options);
      this.http.get(`${this.url}/fcm/accept-status`, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  cancelAccept(token: string) {
    console.log(token);
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });

      this.http.get(`${this.url}/fcm/cancel-accept`, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }


}
