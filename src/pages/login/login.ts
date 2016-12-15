import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { Login } from '../../providers/login';
import { TabsPage } from '../tabs/tabs';

import { IHttpResult } from '../../model';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username: string;
  password: string;

  constructor(
    public navCtrl: NavController,
    private loginProvider: Login,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    // console.log('Hello LoginPage Page');
  }

  login() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging in..'
    });

    loading.present();

    this.loginProvider.login(this.username, this.password)
      .then((data: IHttpResult) => {
        loading.dismiss();
        if (data.ok) {
          localStorage.removeItem('token');
          localStorage.setItem('token', data.token);
          this.navCtrl.setRoot(TabsPage);
        } else {
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: JSON.stringify(data.error),
            buttons: ['OK']
          });
          alert.present();
        }
      }, (error) => {
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: JSON.stringify(error),
          buttons: ['OK']
        });
        alert.present();
      });
  }
}
