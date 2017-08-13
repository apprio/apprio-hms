import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingController, AlertController, ViewController } from 'ionic-angular'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HubDataProvider } from '../../providers/hub-data/hub-data';
import { SelectHubPage } from '../select-hub/select-hub'

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  public user
  public selectHubPage

  constructor(public navCtrl: NavController, public navParams: NavParams,
   public auth: AuthServiceProvider, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public hubDataProvider: HubDataProvider,
    public viewCtrl: ViewController) {
     this.selectHubPage = SelectHubPage
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  public login() {
    var message = "Loading login portal..."
    var loader = this.presentLoadingController(message)
    this.auth.login()
    .then( (data) => {
      loader.dismiss()
      var user = data["user"]
      var tokens = data["tokens"]
      var params = {showLoginToast: true, user: user, tokens: tokens}
      console.log(params)
      if (this.auth.loginPresentedModally) {
        this.viewCtrl.dismiss()
      }
      else {
        this.navCtrl.setRoot(this.selectHubPage, params)
      }
    })
    .catch( (err) => {
      loader.dismiss()
      if (err === "early exit") {
        return 
      }
      console.log(err)
      var message = "Sorry, we couldn't log you in. Try again or check with the system administrator for more help." 
      this.presentAlert(message, "Error")
    })
  }

  presentLoadingController(message) {
    let loader = this.loadingCtrl.create({content: message})
    loader.present()
    return loader
  }

  presentAlert(message, title) {
    let continueButton = {
      text: "Continue",
      role: "Continue",
      handler: () => console.log("Error acknowledged."),
    }
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [continueButton]
    })
    alert.present()
  }

}
