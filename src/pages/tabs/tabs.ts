import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { MessagePage } from '../message/message';
import { ContactPage } from '../contact/contact';
import { SettingPage } from '../setting/setting';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ContactPage;
  tab3Root: any = MessagePage;
  tab4Root: any = SettingPage;

  constructor() {

  }
}
