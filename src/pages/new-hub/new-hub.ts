import { Component } from '@angular/core';
import { ViewController, ModalController, NavParams, 
        LoadingController, AlertController } from 'ionic-angular';
import { HubDataProvider } from '../../providers/hub-data/hub-data';

/**
 * Generated class for the NewHubPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-hub',
  templateUrl: 'new-hub.html',
})

export class NewHubPage {
  public newHub = {}

  constructor(public viewCtrl: ViewController, public navParams: NavParams, 
    public hubDataProvider: HubDataProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
  }

  cancel() {
    this.viewCtrl.dismiss({success: false})
  }

  createHub() {
    let loader = this.loadingCtrl.create({content: "Loading..."})
    loader.present()
    this.hubDataProvider.createHub(this.newHub)
      .then( (data) => {
        loader.dismiss()
        this.viewCtrl.dismiss({success: true})
      })
      .catch ( (err) => {
        console.log(err)
        loader.dismiss()
        this.presentErrorAlert(err)
      })
  }

  logForm() {
    this.createHub()
  }

  presentErrorAlert(err) {
    console.log(err)
    if (err.name == "TimeoutError") {
      var message = "Unable to complete the command. The server may be unavailable at this time.(Timeout)"
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

}
