import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NewHubPage } from '../pages/new-hub/new-hub';
import { SelectHubPage } from '../pages/select-hub/select-hub';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HubDataProvider } from '../providers/hub-data/hub-data';
import { Storage } from '@ionic/Storage';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, 
    splashScreen: SplashScreen, modalCtrl: ModalController,
    storage: Storage) {
    platform.ready().then(() => {
      this.loadUser(storage)
      statusBar.styleDefault();
      splashScreen.hide()
    })
  }

  private loadUser(storage) {
    storage.get("user")
    .then( (user) => {
      storage.get("isLoggedIn")
      .then( (isLoggedIn) => {
        if (isLoggedIn === true) {
          storage.get("tokens")
          .then( (tokens) => {
            console.log("Root page: Select Hub Page")
            this.rootPage = SelectHubPage
          })
          .catch( () => {
            console.log("Root page: Login Page")
            this.rootPage = LoginPage
          })
        }
        else {
          console.log("Root page: Login Page")
          this.rootPage = LoginPage
        }
      })
      .catch( (err) => {
        console.log("Root page: Login Page")
        this.rootPage = LoginPage
      })
    })
    .catch( (err) => {
      console.log(err)
      this.rootPage = LoginPage
    })
  }
}

