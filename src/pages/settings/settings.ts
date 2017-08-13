import { Component } from '@angular/core';
import { ViewController, ModalController, NavParams, 
        LoadingController, AlertController, NavController } from 'ionic-angular';
import { HubDataProvider } from '../../providers/hub-data/hub-data';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login'

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public fields = ["User", "Email", "Hub Count"]
  public fieldVals = ["", "", ""]
  public user 
  public hubs
  public loginPage

  constructor(public viewCtrl: ViewController, public navParams: NavParams, 
    public hubDataProvider: HubDataProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public auth: AuthServiceProvider,
    public navCtrl: NavController) {
      this.user = this.navParams.data.user
      this.hubs = this.navParams.data.hubs
      this.fieldVals = this.parseUser(this.user)
      this.loginPage = LoginPage
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  
  logout() {
    this.auth.logout()
    .then( () => {
      console.log('logged out')
      this.navCtrl.setRoot(this.loginPage)
    })
    .catch ( (err) => {
      console.log('error logging out')
          let continueButton = {
        text: "Continue",
        role: "Continue",
        handler: () => console.log("Error acknowledged."),
      }
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'An error occured while logging you out. Try logging out again.',
        buttons: [continueButton]
      })
      alert.present()
    })
  }

  parseUser(user) {
    var name = user.firstName + " " + user.lastName
    var email = user.email
    var hubCount = this.hubs.length
    var vals = [name, email, hubCount]
    return vals
  }

  presentLogoutHubAlert() {
    let message = "Are you sure you want to log out?"
    let title = "Log out" 
    let cancelButton = {
      text: "Cancel",
      role: "Cancel",
      handler: () => console.log("Canceled log out.")
    }
    let logoutButton = {
      text: "Log out",
      role: "Log out",
      handler: () => this.logout()
    }
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [cancelButton, logoutButton]
    });
    alert.present();
  }

}
