import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { HubDataProvider } from '../../providers/hub-data/hub-data'
import { HomePage } from '../home/home'
import { NewHubPage } from '../new-hub/new-hub'
import { LoginPage } from '../login/login'
import { SettingsPage } from '../settings/settings'
import { LoadingController, AlertController, ToastController } from 'ionic-angular'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/Storage';


/**
 * Generated class for the SelectHubPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-select-hub',
  templateUrl: 'select-hub.html',
})

export class SelectHubPage {
  
  public user
  public hubs = []
  public hubID = ""
  public loader
  private homePage
  private loginPage
  private newHubPage
  private settingsPage 
  public error = "No Hubs found."
  public showLoginToast = true

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public hubDataProvider: HubDataProvider, public loadingCtrl: LoadingController,
    public modalCtrl: ModalController, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public auth: AuthServiceProvider,
    private storage: Storage) {
      this.homePage = HomePage
      this.newHubPage = NewHubPage
      this.loginPage = LoginPage
      this.settingsPage = SettingsPage
      this.configPage()
  }

  // ionViewWillLoad() {
  // }

  private configPage() {
    console.log('ionviewwillappear select hub')
    this.storage.get("user")
    .then( (user) => {
      this.storage.get("tokens")
      .then( (tokens) => {
        this.user = user
        this.hubDataProvider.user = user
        this.hubDataProvider.tokens = tokens
        this.presentLoginToast()
      })
      .catch( (err) => {
        console.log(err)
        this.auth.presentLoginPage()
      })
    })
    .catch( (err) => {
      console.log(err)
      this.auth.presentLoginPage()
    }) 
  }

  public presentLoginToast() {
    if (this.showLoginToast === true) {
      var message = "Welcome back, " + this.user.firstName + "!"
      this.getHubs()
      this.presentToastAlert(message, 5000)
      this.showLoginToast = false
    }
  }

  presentNewHubPage() {
    let newHubModal = this.modalCtrl.create(this.newHubPage)
    newHubModal.onDidDismiss( (data) => {
      if (data.success == true) {
        this.getHubs()
      }
    })
    newHubModal.present()
  }

  presentSettingsPage() {
    var params = {
      user: this.user,
      hubs: this.hubs
    }
    this.navCtrl.push(this.settingsPage, params)
  }

  presentLoginPage() {
    let loginModal = this.modalCtrl.create(this.loginPage)
    loginModal.onDidDismiss( (user) => {
      this.user = user
      this.getHubs()
    })
    loginModal.present()
  }

  getHubs(completion?) {
    this.hubs = []
    var loader = this.loadingCtrl.create({content: 'Loading Hubs...'})
    loader.present()
    this.hubDataProvider.getHubs()
    .then(data => {
      for (var index in data) {
        this.hubs.push(data[index])
      }
      loader.dismiss()
    })
    .catch(err => {
      loader.dismiss()
      this.presentErrorAlert(err)
    })
  }

  refreshHubs(refresher) {
    this.hubDataProvider.getHubs()
    .then(data => {
      this.hubs = []
      for (var index in data) {
        this.hubs.push(data[index])
      }
      refresher.complete()
    })
    .catch(err => {
      refresher.complete()
      this.presentErrorAlert(err)
    })
  }

  getHub(id) {
    for (var element in this.hubs) {
        if ((this.hubs[element].id).toString() == id) { 
            return this.hubs[element]
        }
    }
  }
  
  deleteHub(hub, id) {
    let index =  this.hubs.indexOf(hub)
    this.hubDataProvider.deleteHub(id)
    .then( (data) => {
      this.hubs.splice(index, 1)
      console.log("Deleted!")
    })
    .catch( (err) => {
      console.log(err)
    })
  }

  presentHubControlPage(id) {
    this.navCtrl.push(this.homePage, {
        id: id,
        hubs: this.hubs
      })
  }

  presentDeleteHubAlert(id) {
    let hub = this.getHub(id) 
    let message = "Are you sure you want to delete this Hub? This action cannot be undone."
    let title = "Delete Hub (" + id + ')' 
    let cancelButton = {
      text: "Cancel",
      role: "Cancel",
      handler: () => console.log("Canceled delete.")
    }
    let deleteButton = {
      text: "Delete",
      role: "Delete",
      handler: () => this.deleteHub(hub, id)
    }
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [cancelButton, deleteButton]
    });
    alert.present();
  }

  presentErrorAlert(err) {
    console.log(err)
    if (err.name == "TimeoutError") {
      var message = "Unable to complete the command. The server may be unavailable at this time. (Timeout)"
    }
    else {
      var message = "Unable to complete the command. (" + err.status + ')'
    }
    let continueButton = {
      text: "Continue",
      role: "Continue",
      handler: () => console.log("Error acknowledged."),
    }
    let alert = this.alertCtrl.create({
      title: "Connection Error",
      message: message,
      buttons: [continueButton]
    })
    alert.present()
  }

  presentToastAlert(message, duration?) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration || 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
