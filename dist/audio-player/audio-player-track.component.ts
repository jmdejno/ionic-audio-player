/**
 * Created by jeremydejno on 2/2/17.
 */
import {Component, Input} from '@angular/core';

//audio-player imports
import {AudioPlayer} from "./audio-player";
import {IAudioTrack} from "./audio-player-interfaces";


@Component({
  selector: 'audio-track',
  template: `
    <ion-item>
      <ion-thumbnail item-left>
        <img src="{{track.art}}">
        <audio-track-play [track]="track"><ion-spinner></ion-spinner></audio-track-play>
      </ion-thumbnail>
      <div item-content style="width:100%">
        <ion-card-header><p><strong>{{track.title}}</strong> &#x26AC; <em>{{track.artist}}</em></p></ion-card-header>
        <audio-track-progress-bar duration progress [track]="track"></audio-track-progress-bar>
      </div>
    </ion-item>
    `

})

export class AudioTrackComponent {

  @Input() track: IAudioTrack;

  constructor(private _audioPlayer: AudioPlayer) {}


}
