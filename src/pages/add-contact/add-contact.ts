import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { SQLite } from 'ionic-native';

import { Contact } from '../../providers/contact';
import { IContact } from '../../model';

@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html'
})
export class AddContactPage {

  sexes: Array<{ id: number, name: string }>;
  firstName: string;
  lastName: string;
  sex: string;
  telephone: string;
  email: string;
  id: number;

  db: SQLite;

  constructor(
    public navCtrl: NavController,
    private contactProvider: Contact,
    private navParams: NavParams,
    private platform: Platform,
    private toastCtrl: ToastController
  ) {
    this.id = this.navParams.get('id');
    //Connection
    this.platform.ready().then(() => {
      this.db = new SQLite();
      this.db.openDatabase({
        name: 'contact.db',
        location: 'default'
      })
        .then(() => {
          if (this.id) {
            this.getDetail();
          }
        }, (error) => {
          console.log(error);
        });
    })

    this.sexes = [
      { id: 1, name: 'ชาย' },
      { id: 2, name: 'หญิง' }
    ];

  }

  save() {
    //save
    let contact: IContact = {
      first_name: this.firstName,
      last_name: this.lastName,
      sex: this.sex,
      telephone: this.telephone,
      email: this.email,
      id: this.id
    }

    let promise;
    //
    if (!this.id) {
      promise = this.contactProvider.save(this.db, contact);
    } else {
      promise = this.contactProvider.update(this.db, contact);
    }

    promise.then(() => {
      this.navCtrl.pop();
    }, (error) => {
      console.error(error);
    });
  }

  getDetail() {
    this.contactProvider.getDetail(this.db, this.id)
      .then((rows: any) => {
        // console.log(rows);
        // console.log(rows.item(0).id);
        this.firstName = rows.item(0).first_name;
        this.lastName = rows.item(0).last_name;
        this.sex = rows.item(0).sex;
        this.telephone = rows.item(0).telephone;
        this.email = rows.item(0).email;
      }, error => {
        console.log(error);
      });
  }

  ionViewWillEnter() {
    console.log('Hello AddContactPage Page');
  }

}
