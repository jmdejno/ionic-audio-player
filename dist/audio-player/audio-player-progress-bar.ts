/**
 * Created by jeremydejno on 2/4/17.
 */
import {IAudioTrack} from './audio-player-interfaces';
import {Component, Input, ElementRef, Renderer} from '@angular/core';
import {AudioPlayer} from "./audio-player";

/**
 * # ```<audio-track-progress-bar>```
 *
 * Renders a progress bar with optional timer, duration and progress indicator
 *
 * ## Usage
 * ````
 *  <audio-track-progress-bar duration progress [track]="track"></audio-track-progress-bar>
 * ````
 *
 * @element audio-track-progress-bar
 * @parents audio-track
 * @export
 * @class AudioTrackProgressBarComponent
 */
@Component({
  selector: 'audio-track-progress-bar',
  template: `
    <ion-range [(ngModel)]="track.progress" min="0" max="{{track.duration}}" (ionChange)="seekTo()" name="progress" ngDefaultControl>
      <time *ngIf="showProgress" range-left>{{track.progress | audioTime}}</time>
      <time *ngIf="showDuration" range-right>{{track.duration | audioTime}}</time>
    </ion-range>
    `
})
export class AudioTrackProgressBarComponent {
  /**
   * The AudioTrackComponent parent instance created by ```<audio-track>```
   *
   * @property @Input() audioTrack
   * @type {IAudioTrack}
   */
  @Input() track: IAudioTrack;

  public showDuration: boolean;
  public showProgress: boolean;

  constructor(private _audioPlayer: AudioPlayer, private el: ElementRef, private renderer: Renderer) {}

  /**
   * Input property indicating whether to display track progress
   *
   * @property @Input() progress
   * @type {boolean}
   */
  @Input()
  public set progress(v : boolean) {
    this.showProgress = true;
  }

  /**
   * Input property indicating whether to display track duration
   *
   * @property @Input() duration
   * @type {boolean}
   */
  @Input()
  public set duration(v:  boolean) {
    this.showDuration = true;
  }

  ngOnInit() {
    this.renderer.setElementStyle(this.el.nativeElement, 'width', '100%');
  }

  seekTo() {
    if (this.track.isPlaying) {
      this._audioPlayer.seekTo(this.track.progress)
    }
    console.log(`Seeking to ${this.track.progress}`)
  }
}
