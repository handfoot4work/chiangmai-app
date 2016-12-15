import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { MessagePage } from '../pages/message/message';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SettingPage } from '../pages/setting/setting';
import { AddCustomerPage } from '../pages/add-customer/add-customer';
import { AddContactPage } from '../pages/add-contact/add-contact';

import { Customer } from '../providers/customer';
import { Login } from '../providers/login';
import { Contact } from '../providers/contact';
import { Setting } from '../providers/setting';
import { Message } from '../providers/message';

import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
  declarations: [
    MyApp,
    MessagePage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    MapPage,
    SettingPage,
    AddCustomerPage,
    AddContactPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCdUds26ek02PmRgVhqwRVvwWZ_KMoGMU8'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MessagePage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    MapPage,
    SettingPage,
    AddCustomerPage,
    AddContactPage
  ],
  providers: [
    Login,
    Customer,
    Contact,
    Setting,
    Message,
    { provide: 'API_URL', useValue: 'http://192.168.200.21:3000' },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
