import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/Storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SelectHubPage } from '../pages/select-hub/select-hub';
import { NewHubPage } from '../pages/new-hub/new-hub';
import { HubDataProvider } from '../providers/hub-data/hub-data';
import { HttpModule } from '@angular/http';
import { FabToolbar } from '../components/fab-toolbar/fab-toolbar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LoginPage } from '../pages/login/login';
import { EditHubPage } from '../pages/edit-hub/edit-hub';
import { SettingsPage } from '../pages/settings/settings';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Storage } from '@ionic/Storage';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SelectHubPage,
    NewHubPage,
    FabToolbar, 
    LoginPage,
    EditHubPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SelectHubPage,
    NewHubPage,
    FabToolbar, 
    LoginPage,
    EditHubPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HubDataProvider,
    InAppBrowser,
    AuthServiceProvider
  ]
})
export class AppModule {}
