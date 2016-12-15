import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation, LaunchNavigator, LaunchNavigatorOptions } from 'ionic-native';
import { Customer } from '../../providers/customer';

import { IMapEvent, IHttpResult } from '../../model';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  customerLat: number;
  customerLng: number;
  currentLat: number;
  currentLng: number;
  lat: number;
  lng: number;
  zoomLevel: number = 18;
  customerName: string;
  customerId: number;

  token: string;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private customerProvider: Customer,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.customerId = this.navParams.get('id');
    this.customerName = `${this.navParams.get('first_name')} ${this.navParams.get('last_name')}`;
    this.token = localStorage.getItem('token');
  }

  ionViewDidLoad() {
    // console.log('Hello MapPage Page');

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: "dots"
    });
    loader.present();
    // get map
    this.customerProvider.getMap(this.token, this.customerId)
      .then((data: IHttpResult) => {
        if (data.ok) {
          Geolocation.getCurrentPosition().then((resp) => {
            loader.dismiss();
            this.currentLat = resp.coords.latitude;
            this.currentLng = resp.coords.longitude;
            if (!data.latLng.lat || !data.latLng.lng) {
              this.lat = resp.coords.latitude;
              this.lng = resp.coords.longitude;
            } else {
              this.customerLat = data.latLng.lat;
              this.customerLng = data.latLng.lng;
              this.lat = data.latLng.lat;
              this.lng = data.latLng.lng;
            }
          }).catch((error) => {
            loader.dismiss();
            console.log('Error getting location', error);
          });
        } else {
          //
        }
       }, (error) => {
         let toast = this.toastCtrl.create({
           message: 'Error: ' + JSON.stringify(error),
           duration: 3000
         });
         toast.present();
      });
  }

  getCurrentLocation() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: "dots"
    });
    loader.present();

    Geolocation.getCurrentPosition().then((resp) => {
      loader.dismiss();
      this.currentLat = resp.coords.latitude;
      this.currentLng = resp.coords.longitude;
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.zoomLevel = 18;
      // show latLng
      // alert(resp.coords.latitude + " - " + resp.coords.longitude);
    }).catch((error) => {
      loader.dismiss();
      console.log('Error getting location', error);
    });
  }

  launchNavigator() {
    let options: LaunchNavigatorOptions = {
      start: [this.currentLat, this.currentLng]
    };

    LaunchNavigator.navigate([this.customerLat, this.customerLng], options)
      .then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
      );
  }

  mapClick(event: IMapEvent) {
    this.customerLat = event.coords.lat;
    this.customerLng = event.coords.lng
    this.lat = event.coords.lat;
    this.lng = event.coords.lng

    console.log(this.customerLat, this.customerLng);
    // alert(JSON.stringify(event));
  }

  save() {

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: 'dots'
    });
    loader.present();

    this.customerProvider.saveMap(this.token, this.customerId, this.customerLat, this.customerLng)
      .then((data: IHttpResult) => {
        loader.dismiss();
        if (data.ok) {
          let toast = this.toastCtrl.create({
            message: 'Map saved!',
            duration: 3000
          });
         toast.present();
        } else {
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: JSON.stringify(data.error),
            buttons: ['OK']
          });
          alert.present();
        }
      }, (error) => {
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: JSON.stringify(error),
          buttons: ['OK']
        });
        alert.present();
      });
  }

}
