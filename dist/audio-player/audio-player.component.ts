/**
 * Created by jeremydejno on 2/2/17.
 */
import {Component, Input} from "@angular/core";
import {IAudioTrack} from "./audio-player-interfaces";

@Component({
  selector: 'audio-player',
  template: `
    <ion-item>
      <ion-thumbnail item-left>
        <audio-track-play [track]="track"><ion-spinner></ion-spinner></audio-track-play>
      </ion-thumbnail>
      <div item-content style="width:100%; padding-top: 5px;">
        <p><strong>{{track.title}}</strong> &#x26AC; <em>{{track.artist}}</em></p>
        <audio-track-progress-bar duration progress [track]="track"></audio-track-progress-bar>
      </div>
    </ion-item>
   `
})

export class AudioPlayerComponent {

  constructor() {}

  @Input() track: IAudioTrack;



}
