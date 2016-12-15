import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Push } from 'ionic-native';

import { Setting } from '../../providers/setting';
import { IHttpResult } from '../../model';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {
  accept: boolean;
  token: string;

  constructor(public navCtrl: NavController, private settingProvider: Setting, private toastCtrl: ToastController) {
    this.token = localStorage.getItem('token');
  }

  ionViewWillEnter() {
    // console.log(this.token);
    this.settingProvider.getAcceptStatus(this.token)
      .then((data: IHttpResult) => {
        if (data.ok) {
          this.accept = data.status == 'Y' ? true : false;
        } else {
          console.log(data.error);
        }
      }, (error) => {
        console.log(error);
      });
  }

  changeToggle() {
    if (this.accept) {
      this.registerPush();
    } else {
      this.unregisterPush();
    }
  }

  unregisterPush() {
    this.settingProvider.cancelAccept(this.token)
      .then((data: IHttpResult) => {
        if (data.ok) {
          let toast = this.toastCtrl.create({
              message: 'Unregister successfully',
              duration: 3000
            });
            toast.present();
        } else {
          let toast = this.toastCtrl.create({
            message: 'Unregister failed!',
            duration: 3000
          });
          toast.present();
          console.log(data.error);
        }
      }, (error) => {
        let toast = this.toastCtrl.create({
          message: 'Unregister failed!',
          duration: 3000
        });
        toast.present();
        console.log(error);
    })
  }

  registerPush() {
    let that = this;

    var push = Push.init({
      android: {
        senderID: '127264469005'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    });

    push.on('registration', function(data) {
      let deviceToken = data.registrationId;
      that.settingProvider.saveDeviceToken(that.token, deviceToken)
        .then((data: IHttpResult) => {
          if (data.ok) {
            let toast = that.toastCtrl.create({
              message: 'Register successfully',
              duration: 3000
            });
            toast.present();
          } else {
            let toast = that.toastCtrl.create({
              message: 'Register error!',
              duration: 3000
            });
            toast.present();
            console.log(data.error);
          }
        }, (err) => {
          let toast = that.toastCtrl.create({
            message: 'Register error!',
            duration: 3000
          });
          toast.present();
          console.log(err);
        });
    });

    push.on('notification', function(data) {
      console.log('Push data: ', data);
    });

    push.on('error', function(e) {
      console.log('Push error: ', e);
    });

  }

  logout() {
    localStorage.removeItem('token');
    this.navCtrl.setRoot(LoginPage);
  }

}
