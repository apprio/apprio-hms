import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HubDataProvider } from '../../providers/hub-data/hub-data';
import { LoadingController, AlertController,
         ToastController, ModalController } from 'ionic-angular'
import { EditHubPage } from '../edit-hub/edit-hub'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public editHubPage
  public currentHubID
  public currentHub = {}
  public isPowerOn = false
  public hubs: Array<any> = []
  public user
  public tokens
  public selectAlertOptions = {
    title: "Hubs"
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public hubDataProvider: HubDataProvider, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public toastCtrl: ToastController, 
    public modalCtrl: ModalController, public auth: AuthServiceProvider,
    private storage: Storage ) {
      this.configure(navParams.data)
      this.editHubPage = EditHubPage
  }

  ioniViewDidLoad() {
  }

  ionViewWillAppear(){
  }

  public configure(params) {
    this.currentHubID = params.id
    this.hubs = params.hubs
    this.currentHub = this.getHub(this.currentHubID)
    this.checkPower()
  }

  public presentEditHubPage() {
    let editHubModal = this.modalCtrl.create(this.editHubPage, {hub: this.currentHub})
    editHubModal.onDidDismiss( () => {
      this.refreshData()
    })
    editHubModal.present()
  }

  public selectNewHub(id) {
    this.currentHubID = id
    this.currentHub = this.getHub(id)
  }

  public checkPower() {
    let hub = this.getHub(this.currentHubID)
    let power = hub.power
    if (power == 5) {
      this.isPowerOn = true
    }
    else {
      this.isPowerOn = false
    }
  }

  public getHubs(data) {
    var array = []
    for (var index in data) {
      array.push(data[index])
    }
    this.hubs = []
    this.hubs = array
    this.currentHub = this.getHub(this.currentHubID)
  }

  public getHub(id) {
    for (var element in this.hubs) {
      if ((this.hubs[element].id).toString() == id) { 
        return this.hubs[element]
      }
    }
  }

  public refreshData() {
    this.hubs = []
    var loader = this.loadingCtrl.create({content: 'Refreshing...'})
    loader.present()
    this.hubDataProvider.getHubs()
    .then(data => {
      for (var index in data) {
        this.hubs.push(data[index])
      }
      loader.dismiss()
      let message = "Hub data refreshed."
      this.presentToastAlert(message)
    })
    .catch(err => {
      loader.dismiss()
      this.presentErrorAlert(err)
    })
  }

  public changeBrightness(operator) {
    let hub = this.getHub(this.currentHubID)
    let id = hub.id
    let url = hub.pi.url
    this.hubDataProvider.changeBrightness(id, operator, url)
    .then( (data) => {
      this.getHubs(data)
    })
    .catch( (err) => {
      this.presentErrorAlert(err)
    })
  }

  public changeVolume(operator) {
    let hub = this.getHub(this.currentHubID)
    let id = hub.id
    let url = hub.pi.url
    this.hubDataProvider.changeVolume(id, operator, url)
    .then( () => {
    })
    .catch( (err) => {
      this.presentErrorAlert(err)
    })
  }

  public changeSource(src) {
    let hub = this.getHub(this.currentHubID)
    let id = hub.id
    let url = hub.pi.url
    let loader = this.loadingCtrl.create({content: "Changing source..."})
    loader.present()
    this.hubDataProvider.changeSource(id, src, url)
    .then( (data) => {
      loader.dismiss()
      this.getHubs(data)
      var source
      switch (src) {
        case "0": 
          source = "PC"
          break
        case "1": 
          source = "DisplayPort"
          break
        case "2": 
          source = "HDMI"
          break
        case "3": 
          source = "VGA"
          break
        default: source = ""
      }
      let message = "Source changed to  " + source + '.'
      this.presentToastAlert(message)
    })
    .catch( (err) => {
      loader.dismiss()
      this.presentErrorAlert(err)
    })
  }

  public changePowerState() {
    let hub = this.getHub(this.currentHubID)
    let message = "You just hit the power button. Are you sure you want to do this?"
    let cancelButton = {
      text: "Cancel",
      role: "Cancel",
      handler: () => {}
    }
    let continueButton = {
      text: "Continue",
      role: "Continue",
      handler: () => this.power(hub)
    }
    let alert = this.alertCtrl.create({
      title: "Power",
      message: message,
      buttons: [cancelButton, continueButton]
    })
    alert.present()
  }

  public power(hub) {
    let power = hub.power
    let id = hub.id
    let url = hub.pi.url
    let loader = this.loadingCtrl.create({content: "Toggling power..."})
      loader.present()
      this.hubDataProvider.changePowerState(id, url)
      .then( (data) => {
        loader.dismiss()
        this.getHubs(data)
        var power
        switch (power) {
          case "0":
           power = "off"
           break
          case "5":
            power = "on"
            break
          default:
            power = "error"
        }
        if (power != "error") {var message = "Power turned " + power + '.'}
        else {var messge = "Error toggling power."}
        this.presentToastAlert(message)
      })
      .catch( (err) => {
        loader.dismiss()
        this.presentErrorAlert(err)
      })
  }
  
  public toggleMute() {
    let hub = this.getHub(this.currentHubID)
    let id = hub.id
    let url = hub.pi.url
    let loader = this.loadingCtrl.create({content: "Toggling mute..."})
    loader.present()
    this.hubDataProvider.toggleMute(id, url)
    .then( (data) => {
      loader.dismiss()
      this.getHubs(data)
      var message = "Mute toggled."
      this.presentToastAlert(message)
    })
    .catch( (err) => {
      loader.dismiss()
      this.presentErrorAlert(err)
    })
  }

  public presentErrorAlert(err) {
    console.error(err) 
    if (err.name == "TimeoutError") {
      var message = "Unable to complete the command. (Timeout)"
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
    alert.onDidDismiss( () => {
      if (err.status === 401) {
        this.auth.presentLoginPage()
      }
    })
  }

  presentToastAlert(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

}
