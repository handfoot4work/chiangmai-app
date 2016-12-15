import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { Message } from '../../providers/message';
import { IHttpResult } from '../../model';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {
  users: Array<{ id: number, fullname: string }>;
  message: string;
  userId: number;
  token: string;

  constructor(public navCtrl: NavController, private messageProvider: Message, private toastCtrl: ToastController) {
    this.token = localStorage.getItem('token');
  }

  ionViewDidLoad() {
    this.messageProvider.getUsersList(this.token)
      .then((data: IHttpResult) => {
        this.users = data.rows;
      });
  }

  sendMessage() {

    this.messageProvider.sendMessage(this.token, this.userId, this.message)
      .then((data: IHttpResult) => {
        if (data.ok) {
          let toast = this.toastCtrl.create({
              message: 'Message has been sent',
              duration: 3000
            });
            toast.present();
        } else {
          let toast = this.toastCtrl.create({
              message: 'Send failed!',
              duration: 3000
            });
          toast.present();
          console.log(data.error);
        }
      }, (error) => {
        let toast = this.toastCtrl.create({
          message: 'Send failed!',
          duration: 3000
        });
        toast.present();
        console.log(error);
      });

  }

}
