import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/Storage';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

@Injectable()
export class HubDataProvider {

  public apiURL = 'https://apprio-pi-server-heroku.herokuapp.com'
  public timeout = 15000
  public user 
  public tokens 

  constructor(private http: Http, private storage: Storage) {
    console.log('Hello HubDataProvider Provider');
  }

  public getHeaders() {
    let headers = new Headers()
    headers.append('Content-type', 'application/json')
    headers.append('id_token', this.tokens.id_token)
    headers.append('refresh_token', this.tokens.refresh_token)
    headers.append('access_token', this.tokens.access_token)
    headers.append("email", this.user.email)
    return {headers: headers}
  }

  public getUserAndTokens() {
    return new Promise((resolve, reject) => {
      this.storage.get("user")
      .then((user) => {
        this.storage.get("tokens")
        .then((tokens) => {
          this.user = user
          this.tokens = tokens
          resolve()
        })
        .catch((err) => {
          console.log(err)
          reject()
        })
      })
      .catch( (err) => {
        reject()
      })
    })
  }
  private updateUser(res) {
    this.tokens.access_token = res.headers.get("Access_token")
    this.tokens.refresh_token = res.headers.get("Refresh_token")
    this.tokens.id_token = res.headers.get("Id_token")
    this.storage.set("user", this.user)
  }

  public authorize() {
    let url = this.apiURL + '/authorize'
    return new Promise( (resolve, reject) => {
      this.http.get(url) 
      .timeout(this.timeout)
      .map( (res) => res.json())
      .subscribe(
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
      })
    })
  }

  public getTokenData(authCode) {
    let url = this.apiURL + "/getTokenData"
    return new Promise( (resolve, reject) => {
      this.http.get(url + "?code=" + authCode) 
      .timeout(this.timeout)
      .map( (res) => res.json())
      .subscribe(
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
      })
    })
  }

  public getHubs() {
    let url = this.apiURL + '/hubs'
    return new Promise( (resolve, reject) => {
      // resolve(this.hubs) // @TODO MAKE SURE YOU CHANGE THIS //
      this.http.get(url, this.getHeaders())
      .timeout(this.timeout)
      .map( (res) => {
        this.updateUser(res)
        return res.json()
      })
      .subscribe(
        (data) => {
          resolve(data); 
        },
        (err) => {
          reject(err)
      })
    })
  }

  public createHub(hub) {
    var hubURL = hub.url 
    let url = hubURL + '/hubs/create'
    var headers = this.getHeaders()
    return new Promise( (resolve, reject) => {
      this.http.post(url, hub, headers)
      .timeout(this.timeout)
      .map( (res) => {
        this.updateUser(res)
        return res.json()
      })
      .subscribe(
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
        })
    })
  }

  public deleteHub(id) {
    let url = this.apiURL + '/hubs/delete?id=' + id
    return new Promise( (resolve, reject) => {
      this.http.delete(url, this.getHeaders())
      .timeout(this.timeout)
      .map( (res) => {
        this.updateUser(res)
        return res.json()
      })
      .subscribe(
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  public editHub(hub) {
    let id = hub.id
    let hubURL = hub.url
    let url = this.apiURL + "/hubs/edit"
    let body = hub
    return new Promise( (resolve, reject) => {
      this.http.put(url, body, this.getHeaders())
      .timeout(this.timeout)
      .map( (res) => {
        this.updateUser(res)
        return res.json()
      })
      .subscribe(
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  public changeBrightness(id, operator, hubURL) {
    let url = hubURL + '/hubs/brightness'
    // let url = this.apiURL + '/hubs/brightness'
    let body = {
      id: id,
      operator: operator
    }
    return new Promise( (resolve, reject) => {
      this.http.put(url, body, this.getHeaders())
      .timeout(this.timeout)
      .map( (res) => {
        this.updateUser(res)
        return res.json()
      })
      .subscribe( 
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  public changeVolume(id, operator, hubURL) {
    let url = hubURL + '/hubs/volume'
    // let url = this.apiURL + '/hubs/volume'
    let body = {
      id: id,
      operator: operator
    }
    return new Promise( (resolve, reject) => {
      this.http.put(url, body, this.getHeaders())
      .timeout(this.timeout)
      .map( (res) => {
        this.updateUser(res)
        return res.json()
      })
      .subscribe( 
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }


  public changeSource(id, source, hubURL) {
    let url = hubURL + '/hubs/source'
    // let url = this.apiURL + '/hubs/source'
    let body = {
      id: id,
      source: source
    }
    return new Promise( (resolve, reject) => {
      this.http.put(url, body, this.getHeaders())
      .timeout(this.timeout)
      .map( (res) => {
        this.updateUser(res)
        return res.json()
      })
      .subscribe( 
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  public changePowerState(id, hubURL) {
    let url = hubURL + '/hubs/powerstate'
    let body = {
      id: id
    }
    return new Promise( (resolve, reject) => {
      this.http.put(url, body, this.getHeaders())
      .timeout(this.timeout)
      .map( (res) => {
        this.updateUser(res)
        return res.json()
      })
      .subscribe( 
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  public toggleMute(id, hubURL) {
    let url = hubURL + '/hubs/mute'
    let body = {
      id: id
    }
    return new Promise( (resolve, reject) => {
      this.http.put(url, body, this.getHeaders())
      .timeout(this.timeout)
      .map( (res) => {
        this.updateUser(res)
        return res.json()
      })
      .subscribe( 
        (data) => {
          resolve(data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

}
