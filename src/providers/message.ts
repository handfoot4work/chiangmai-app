import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Message {

  constructor(public http: Http, @Inject('API_URL') private url: string) {

  }

    getUsersList(token: string) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });

      this.http.get(`${this.url}/fcm/users-list`, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  sendMessage(token: string, userId: number, message: string) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      let body = { message: message, userId: userId };

      this.http.post(`${this.url}/fcm/send-message`, body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    })

  }


}
