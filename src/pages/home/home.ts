import { Component } from '@angular/core';

import { NavController, LoadingController, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import { CallNumber } from 'ionic-native';
import { Customer } from '../../providers/customer';
import { AddCustomerPage } from '../add-customer/add-customer';
import { MapPage } from '../map/map';
import { LoginPage } from '../login/login';
import { JwtHelper } from 'angular2-jwt';

import { IHttpResult, ICustomer } from '../../model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  token: string;
  customers: Array<ICustomer> = [];
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    public navCtrl: NavController,
    private customerProvider: Customer,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {
    this.token = localStorage.getItem('token');
    console.log(
      this.jwtHelper.decodeToken(this.token),
      this.jwtHelper.getTokenExpirationDate(this.token),
      this.jwtHelper.isTokenExpired(this.token)
    );
  }

  getCustomers() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait..'
    });

    loading.present();
    this.customers = [];
    this.customerProvider.list(this.token)
      .then((data: IHttpResult) => {
        loading.dismiss();
        if (data.ok) {

          data.rows.forEach((v: ICustomer) => {
            let image = v.image ? `data:image/jpeg;base64,${v.image}` : null;
            let customer: ICustomer = {
              id: v.id,
              first_name: v.first_name,
              last_name: v.last_name,
              sex: v.sex,
              customer_type_id: v.customer_type_id,
              image: image,
              telephone: v.telephone,
              email: v.email
            }
            this.customers.push(customer);
          });
        } else {
          console.error(data.error);
        }
      }, (error) => {
        loading.dismiss();
        console.error(error);
      });
  }

  add() {
    this.navCtrl.push(AddCustomerPage);
  }

  removeConfirm(customer: ICustomer) {
    let confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'ต้องการลบรายการนี้ ใช่หรือไม่?',
      buttons: [
        {
          text: 'ยกเลิก',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: 'ลบข้อมูล',
          handler: () => {
            this.customerProvider.remove(this.token, customer.id)
              .then((data: IHttpResult) => {
                if (data.ok) {
                  this.getCustomers();
                }
              }, (error) => {
                console.log(error);
              });
          }
        }
      ]
    });
    confirm.present();
  }

  showMenu(customer: ICustomer) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Action menu',
      buttons: [
        {
          text: 'ลบข้อมูล',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash': null,
          handler: () => {
            this.removeConfirm(customer);
          }
        },
        {
          text: 'แก้ไข',
          icon: !this.platform.is('ios') ? 'create': null,
          handler: () => {
            this.navCtrl.push(AddCustomerPage, { id: customer.id });
          }
        },
        {
          text: 'ดู/กำหนด แผนที่',
          icon: !this.platform.is('ios') ? 'map': null,
          handler: () => {
            this.navCtrl.push(MapPage, customer);
          }
        },
        {
          text: 'โทร',
          icon: !this.platform.is('ios') ? 'call': null,
          handler: () => {
            if (customer.telephone) {
              CallNumber.callNumber(customer.telephone, true)
                .then(() => console.log('Launched dialer!'))
                .catch(() => console.log('Error launching dialer'));
            }
          }
        },
        {
          text: 'ยกเลิก',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close': null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  search(event) {
    let query = event.target.value;
    // let loading = this.loadingCtrl.create({
    //   spinner: 'dots',
    //   content: 'Please wait..'
    // });

    // loading.present();
    this.customers = [];
    this.customerProvider.search(this.token, query)
      .then((data: IHttpResult) => {
        // loading.dismiss();
        if (data.ok) {

          data.rows.forEach((v: ICustomer) => {
            let image = v.image ? `data:image/jpeg;base64,${v.image}` : null;
            let customer: ICustomer = {
              id: v.id,
              first_name: v.first_name,
              last_name: v.last_name,
              sex: v.sex,
              customer_type_id: v.customer_type_id,
              image: image,
              telephone: v.telephone,
              email: v.email
            }
            this.customers.push(customer);
          });
        } else {
          console.error(data.error);
        }
      }, (error) => {
        // loading.dismiss();
        console.error(error);
      });
  }

  ionViewWillEnter() {
    this.getCustomers();
  }

}
