import { Component } from '@angular/core';
import {AudioPlayer} from "../../../../../dist/audio-player/audio-player";
import {HomePage} from "../home/home";

/**
 * Generated class for the Tabs tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class Tabs {

  tab1Root: any = HomePage;

  constructor(public _audioPlayer: AudioPlayer) {}

}
