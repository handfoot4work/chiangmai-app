import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform) {
    platform.ready().then(() => {

      StatusBar.backgroundColorByHexString('#34465d');
      Splashscreen.hide();

      let db = new SQLite();
      db.openDatabase({
        name: 'contact.db',
        location: 'default'
      }).then(() => {
        let sqlCreateTable = `CREATE TABLE IF NOT EXISTS contact(id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, sex TEXT, telephone TEXT, email TEXT)`;
        db.executeSql(sqlCreateTable, [])
          .then(() => {
            console.log('Create table success');
          }, error => {
            console.log(error);
          });
      }, (err) => {
        console.error('Unable to open database: ', err);
      });

      let token = localStorage.getItem('token');
      this.rootPage = token ? TabsPage : LoginPage;
    });
  }
}
