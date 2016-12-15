import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';

import { ICustomer } from '../model';

@Injectable()
export class Customer {

  constructor(public http: Http, @Inject('API_URL') private url: string) {
    console.log('Hello Customer Provider');
  }


  list(token: string) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      this.http.get(`${this.url}/customers`, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  search(token: string, query: string) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      this.http.get(`${this.url}/customers/search/${query}`, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  detail(token: string, customerId) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      this.http.get(`${this.url}/customers/detail/${customerId}`, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  remove(token: string, customerId) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });

      this.http.delete(`${this.url}/customers/${customerId}`, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  getGroups(token: string) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      this.http.get(`${this.url}/customers/groups`, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  saveCustomer(token: string, customer: ICustomer) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      let body = {
        firstName: customer.first_name,
        lastName: customer.last_name,
        sex: customer.sex,
        customerTypeId: customer.customer_type_id,
        telephone: customer.telephone,
        email: customer.email,
        image: customer.image
      };

      this.http.post(`${this.url}/customers`, body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  updateCustomer(token: string, customer: ICustomer) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      let body = {
        customerId: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        sex: customer.sex,
        customerTypeId: customer.customer_type_id,
        telephone: customer.telephone,
        email: customer.email,
        image: customer.image
      };

      this.http.put(`${this.url}/customers`, body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  saveMap(token: string, customerId: number, lat: number, lng: number) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      let body = { customerId: customerId, lat: lat, lng: lng };

      this.http.post(`${this.url}/customers/save-map`, body, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });

  }

  getMap(token: string, customerId: number) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });

      this.http.get(`${this.url}/customers/get-map/${customerId}`, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        });
    });
  }

}
