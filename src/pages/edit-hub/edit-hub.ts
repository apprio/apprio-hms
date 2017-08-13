import { Component } from '@angular/core';
import {  NavController, NavParams, 
          ViewController, AlertController, 
          LoadingController} from 'ionic-angular';
import { HubDataProvider } from '../../providers/hub-data/hub-data';
/**
 * Generated class for the EditHubPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-hub',
  templateUrl: 'edit-hub.html',
})

export class EditHubPage {
  public newHub = {}
  public id

  constructor(public viewCtrl: ViewController, public navParams: NavParams, 
    public hubDataProvider: HubDataProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
      this.id = navParams.data.hub.id
      this.newHub = navParams.data.hub
      this.newHub["id"] = this.id
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditHubPage');
  }

  public cancel() {
    this.viewCtrl.dismiss()
  }

  public editHub() {
    let loader = this.loadingCtrl.create({content: "Loading..."})
    loader.present()
    this.hubDataProvider.editHub(this.newHub)
      .then( (data) => {
        loader.dismiss()
        this.viewCtrl.dismiss()
      })
      .catch ( (err) => {
        loader.dismiss()
        this.presentErrorAlert(err)
      })
  }

  public logForm() {
    this.editHub()
  }

  public presentErrorAlert(err) {
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

}
