import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { SQLite } from 'ionic-native';

import { IContact } from '../model';

@Injectable()
export class Contact {

  getContacts(db: SQLite) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM contact`;
      db.executeSql(sql, [])
        .then(data => {
          resolve(data.rows);
        }, error => {
          reject(error);
        });
    });
  }

  search(db: SQLite, query: string) {
    return new Promise((resolve, reject) => {
      let promise;
      if (query) {
        let _query = `%${query}%`;
        let sql = `SELECT * FROM contact WHERE first_name LIKE ?`;
        promise = db.executeSql(sql, [_query]);
      } else {
        let sql = 'SELECT * FROM contact';
        promise = db.executeSql(sql, [])
      }

      promise.then(data => {
        resolve(data.rows);
      }, error => {
        reject(error);
      });
    });
  }

  getDetail(db: SQLite, id: number) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM contact WHERE id=?`;
      db.executeSql(sql, [id])
        .then(data => {
          resolve(data.rows);
        }, error => {
          reject(error);
        });
    });
  }

  save(db: SQLite, contact: IContact) {
    return new Promise((resolve, reject) => {
      let sql = `INSERT INTO contact(first_name, last_name, sex, telephone, email)
      VALUES(?, ?, ?, ?, ?)`;

      db.executeSql(sql, [contact.first_name, contact.last_name, contact.sex, contact.telephone, contact.email])
        .then(data => {
          resolve(data.rows);
        }, error => {
          reject(error);
        });
    });
  }

  update(db: SQLite, contact: IContact) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE contact SET first_name=?, last_name=?, sex=?, telephone=?, email=? WHERE id=?`;

      db.executeSql(sql, [contact.first_name, contact.last_name, contact.sex, contact.telephone, contact.email, contact.id])
        .then(data => {
          resolve();
        }, error => {
          reject(error);
        });
    });
  }

  remove(db: SQLite, contact: IContact) {
    return new Promise((resolve, reject) => {
      let sql = `DELETE FROM contact WHERE id=?`;

      db.executeSql(sql, [contact.id])
        .then(data => {
          resolve();
        }, error => {
          reject(error);
        });
    });
  }
}
