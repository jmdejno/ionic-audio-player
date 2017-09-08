/**
 * Created by jeremydejno on 2/4/17.
 */
import {IAudioTrack} from './audio-player-interfaces';
import {AudioPlayer} from './audio-player';
import {Component, Input} from '@angular/core';


/**
 * Renders a play/pause button that optionally displays a loading spinner
 *
 * @element audio-track-play
 * @parents audio-track
 * @export
 * @class AudioTrackPlayComponent
 */
@Component({
  selector: 'audio-track-play',
  template:`
    <button ion-button icon-only clear (click)="toggle($event)" [disabled]="track.isLoading">
      <ion-icon name="pause" *ngIf="track.isPlaying && !track.isLoading"></ion-icon>
      <ion-icon name="play" *ngIf="!track.isPlaying && !track.isLoading"></ion-icon>
      <ng-content *ngIf="track.isLoading"></ng-content>
    </button>`

})

export class AudioTrackPlayComponent {

  @Input() track: IAudioTrack;

  constructor(private _audioPlayer: AudioPlayer) {}

  toggle(event: Event){
    if (this.track.isPlaying) {
      this._audioPlayer.pause();
    } else {
      this._audioPlayer.play(this.track);
    }
  }
}
