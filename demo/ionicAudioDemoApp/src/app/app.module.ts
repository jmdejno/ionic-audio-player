import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AudioPlayerModule } from '../../../../../audio-player/dist/audio-player/audio-player.module';
import 'rxjs/add/operator/map';
import {HttpModule} from "@angular/http";
import {AudioPlayer, audioPlayerfactory} from "../../../../dist/audio-player/audio-player";
import {Tabs} from "../pages/tabs/tabs";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Tabs
  ],
  imports: [
    BrowserModule,
    AudioPlayerModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: AudioPlayer, useFactory: audioPlayerfactory },
  ]
})
export class AppModule {}
