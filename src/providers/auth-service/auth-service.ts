import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { HubDataProvider } from '../../providers/hub-data/hub-data';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LoginPage } from '../../pages/login/login';
import { LoadingController, ModalController } from 'ionic-angular'
import { Storage } from '@ionic/Storage';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthServiceProvider {
  public browser
  public url
  public user = {
      firstName: null,
      lastName: null,
      email: null
  }
  public tokens = {
    access_token: null,
    refresh_token: null,
    id_token: null
  }
  
  public loginPage
  public loginPresentedModally = false

  constructor(public http: Http, public iab: InAppBrowser,
  public hubDataProvider: HubDataProvider, public platform: Platform,
  public modalCtrl: ModalController, public storage: Storage) {
    this.loginPage = LoginPage
  }

  public login() {
    return new Promise( (resolve, reject) => {
      this.loadURL()
      .then( () => {
        this.office365Login()
        .then( (data) => { 
          this.storeUser(data)
          .then( () => {
            resolve({user: this.user, tokens: this.tokens})
          })
        })
        .catch( (err) => {
          reject(err)
        })
      })
      .catch( (err) => {
        reject(err)
      })
    })
  }

  public logout() {
    return new Promise( (resolve, reject) => {
      console.log("logout tapped")
      this.storage.remove("user")
      this.storage.remove("tokens")
      this.storage.set("isLoggedIn", false)
      resolve()
    })
  }

  private storeUser(data) {
    return new Promise((resolve, reject) => {
      var name = this.parseName(data.user_info.name.split(" "))
      this.user.firstName = String(name[0])
      this.user.lastName = String(name[1])
      this.user.email = data.user_info.email
      this.tokens.access_token = data.access_token
      this.tokens.refresh_token = data.refresh_token
      this.tokens.id_token = data.id_token
      this.hubDataProvider.user = this.user
      this.hubDataProvider.tokens = this.tokens
      console.log(data)
      this.storage.set("user", this.user)
      this.storage.set("tokens", {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          id_token: data.id_token
      })
      this.storage.set("isLoggedIn", true)
      resolve()
    })
  }

  public loadUser() {

  }

  public presentLoginPage() {
    var loginModal = this.modalCtrl.create(this.loginPage)
    this.loginPresentedModally = true
    loginModal.onDidDismiss( (data) => {
      this.user = data.user
      this.loginPresentedModally = false
    })
    loginModal.present()
  }
  
  private loadURL() {
    return new Promise( (resolve, reject) => {
      this.hubDataProvider.authorize()
      .then( (data) => {
        this.url = data["url"]
        resolve()
      })
      .catch( (err) => {
        reject(err)
      })
    })
  }

  private parseURL(url: string) {
    var responseParameters = ((url).split("?")[1]).split("&");
    var parsedResponse = {};
    for (var i = 0; i < responseParameters.length; i++) {
      parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
    }
    if (parsedResponse["code"] !== undefined 
      && parsedResponse["code"] !== null) {
       return parsedResponse
    } else {
        return "Problem authenticating"
    }
  }

  private parseName(name: [String]) {
    var nameCount = name.length
    var first = name[0]
    var last = ""
    for (var i=1; i < nameCount; i++) {
      if (i < nameCount -1) {
        last += name[i] + " "
      }
      else {
        last += name[i]
      }
      return [first, last]
    }
  }

  private office365Login(): Promise<any> {
    return new Promise( (resolve, reject) => {
      if (this.url) {
        var options = "location=no, clearcache=yes, toolbar=no"
        this.browser = this.iab.create(this.url, "_blank", options)
        this.browser.on("exit").subscribe( () => {
          reject("early exit")
        })
        this.browser.on("loadstart").subscribe( (event) => {
          if ((event.url).indexOf("https://apprio-pi-server-heroku.herokuapp.com/authorize") === 0) {
            var authCode = this.parseURL(event.url)["code"]
            this.getTokenData(authCode)
            .then( (data) => {
              resolve(data)
              this.browser.close()
            })
            .catch( (err) => {
              reject(err)
              this.browser.close()
            })
          }
        })
      }
      else {
        reject("No url loaded.")
      }
    })
  }
         
  private getTokenData(authCode) {  
    return new Promise( (resolve, reject) => {
      this.hubDataProvider.getTokenData(authCode)
      .then( (data) => {
        resolve(data)
      })
      .then( (err) => {
        reject(err)
      })
    }) 
  }

}
