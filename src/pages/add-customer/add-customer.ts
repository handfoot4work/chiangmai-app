import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from 'ionic-native';

import { IHttpResult, IGroup, ICustomer } from '../../model';
import { Customer } from '../../providers/customer';

@Component({
  selector: 'page-add-customer',
  templateUrl: 'add-customer.html'
})
export class AddCustomerPage {
  sexes: Array<{ id: number, name: string }>;
  groups: Array<IGroup>;
  token: string;
  imageData: string;
  base64Image: string;
  firstName: string;
  lastName: string;
  sex: string;
  customerTypeId: number;
  email: string;
  telephone: string;

  customerId: number;

  constructor(
    public navCtrl: NavController,
    private customerProvider: Customer,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams
  ) {
    this.token = localStorage.getItem('token');
    this.customerId = this.navParams.get('id');

    this.sexes = [
      {id: 1, name: 'ชาย'},
      {id: 2, name: 'หญิง'}
    ]
  }

  takePicture() {
    let options: CameraOptions;
    options = {
      quality: 60,
      sourceType: 1,
      destinationType: 0
    }
    Camera.getPicture(options).then((imageData) => {
      this.imageData = imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // error
    });
  }

  browsePicture() {
    let options: CameraOptions;
    options = {
      quality: 60,
      sourceType: 0,
      destinationType: 0
    }
    Camera.getPicture(options).then((imageData) => {
      this.imageData = imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
        // error
    });
  }
  // remove picture
  removePicture() {

    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'ต้องการลบภาพนี้ ใช่หรือไม่?',
      buttons: [
        {
          text: 'ไม่',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: 'ใช่',
          handler: () => {
            // this.serviceProvider.removeImage(this.vn, this.token)
            //   .then(() => {
            //     this.base64Image = null;
            //     this.imageData = null;
            //   }, (err) => {
            //     console.error(err);
            //   });
          }
        }
      ]
    });
    // has picture
    if (this.base64Image) confirm.present();
  }


  // save customer
  save() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait..'
    });

    loading.present();
    if (this.firstName && this.lastName && this.customerTypeId && this.sex) {
      let customer: ICustomer = {
        first_name: this.firstName,
        last_name: this.lastName,
        sex: this.sex,
        customer_type_id: this.customerTypeId,
        telephone: this.telephone,
        email: this.email,
        image: this.imageData
      };

      let promise;

      if (this.customerId) {
        customer.id = this.customerId;
        promise = this.customerProvider.updateCustomer(this.token, customer);
      } else {
        promise = this.customerProvider.saveCustomer(this.token, customer);
      }
      // save/update
      promise.then((data: IHttpResult) => {
          // success
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: 'User was added successfully',
            duration: 3000
          });
          toast.present();
          this.navCtrl.pop();
        }, (error) => {
          // error
          loading.dismiss();
          console.error(error);
        });

    } else {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'กรุณากรอกรายละเอียดที่จำเป็นให้ครบถ้วน!',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait..'
    });
    loading.present();

    this.customerProvider.getGroups(this.token)
      .then((data: IHttpResult) => {
        this.groups = data.rows;
          //get customer detail
          if (this.customerId) {
            this.customerProvider.detail(this.token, this.customerId)
              .then((data: IHttpResult) => {
                loading.dismiss();
                this.imageData = data.customer.image;
                this.base64Image = data.customer.image ? 'data:image/jpeg;base64,' + data.customer.image : null;
                this.firstName = data.customer.first_name;
                this.lastName = data.customer.last_name;
                this.sex = data.customer.sex;
                this.customerTypeId = data.customer.customer_type_id;
                this.email = data.customer.email;
                this.telephone = data.customer.telephone;
              }, (error) => {
                loading.dismiss();
                console.error(error);
              });
          } else {
            loading.dismiss();
          }
      });
  }

}
