import { Component } from '@angular/core';

import { NavController, Platform, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { SQLite, CallNumber } from 'ionic-native';
import { Contact } from '../../providers/contact';
import { IContact } from '../../model';

import { AddContactPage } from '../add-contact/add-contact';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  contacts: Array<IContact>;
  db: SQLite;
  constructor(
    public navCtrl: NavController,
    private contactProvider: Contact,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {

    this.platform.ready().then(() => {
      this.db = new SQLite();
      this.db.openDatabase({
        name: 'contact.db',
        location: 'default'
      }).then(() => {
        this.getContacts();
       });
    })

  }

  getContacts() {

    let loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Please wait..'
      });

      loading.present();

      this.contactProvider.getContacts(this.db)
        .then((rows: any) => {
          loading.dismiss();
          this.contacts = [];

          if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
              this.contacts.push({
                id: rows.item(i).id,
                first_name: rows.item(i).first_name,
                last_name: rows.item(i).last_name,
                sex: rows.item(i).sex,
                telephone: rows.item(i).telephone,
                email: rows.item(i).email
              });
            }
          }
        }, error => {
          loading.dismiss();
          console.log(error);
        });

  }

  add() {
    this.navCtrl.push(AddContactPage);
  }

  edit(contact: IContact) {
    this.navCtrl.push(AddContactPage, contact);
  }

  remove(contact: IContact) {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'ต้องการลบรายการนี้ ['+ contact.first_name +' '+ contact.last_name +'] ใช่หรือไม่?',
      buttons: [
        {
          text: 'ใช่,ต้องการลบ',
          handler: () => {
            this.contactProvider.remove(this.db, contact.id)
              .then(() => {
                let toast = this.toastCtrl.create({
                  message: 'Deleted!',
                  duration: 3000
                });
                toast.present();
                // get contact
                this.getContacts();
              });
          }
        },
        {
          text: 'ไม่ใช่',
          handler: () => {
            //
          }
        }
      ]
    });
    confirm.present();
  }

  callPhone(telephone: string) {
    if (telephone) {
      CallNumber.callNumber(telephone, true)
        .then(() => console.log('Launched dialer!'))
        .catch(() => console.log('Error launching dialer'));
    }
  }

  search(event) {
    let query = event.target.value;

    this.contactProvider.search(this.db, query)
      .then((rows: any) => {
          // loading.dismiss();
            this.contacts = [];

            if (rows.length > 0) {
              for (let i = 0; i < rows.length; i++) {
                this.contacts.push({
                  id: rows.item(i).id,
                  first_name: rows.item(i).first_name,
                  last_name: rows.item(i).last_name,
                  sex: rows.item(i).sex,
                  telephone: rows.item(i).telephone,
                  email: rows.item(i).email
                });
              }
            }

      });
    }

  ionViewWillEnter() {
    this.getContacts();
  }

}
