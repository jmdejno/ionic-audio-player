/**
 * Created by jeremydejno on 2/2/17.
 */
import {Injectable} from "@angular/core";
import {WebAudioTrack} from './audio-player-web-track';
import {IAudioPlayer, IAudioTrack} from "./audio-player-interfaces";
import {CordovaAudioTrack} from "./audio-player-cordova-track";
import {MediaPlugin} from 'ionic-native';


/**
* Creates an audio player based on the environment.
* If running from within a browser, then defaults to HTML5 Audio. If running on a device, it will check for Cordova and Media plugins and use
* a native audio player, otherwise falls back to HTML5 audio.
*
* @method factory
* @static
* @return AudioPlayer
*/
export function audioPlayerfactory() {
  return window.hasOwnProperty('cordova') && window.hasOwnProperty('Media') ? new CordovaAudioPlayer(new CordovaAudioTrack()) : new WebAudioPlayer(new WebAudioTrack());
}


@Injectable()
export abstract class AudioPlayer implements IAudioPlayer {

  //TODO: Implement next track for faster playback on track switch
  //private _next: WebAudioTrack;
  private _tracks: IAudioTrack[] = [];
  private _current: IAudioTrack;

  /*
  * Instantiate single instance of AudioPlayer with Audio, either Cordova or HTML
  * */
  constructor(private _audio: WebAudioTrack | CordovaAudioTrack) {}

  /*
  * Add IAudioTrack instance to array of tracks.
  *
  * @method add
  * @param {IAudioTrack} track - instance of IAudioTrack
  * @return index {number}
  * */
  add(track: IAudioTrack): number{
    track.id = this._tracks.push(track)-1;
    return track.id;
  }

  /**
   * Play either passed in track or play current track
   *
   * @param track plays instance of IAudioTrack
   */
  play(track?: IAudioTrack) {
    //no track and no current, return.
    if(this._audio.src === undefined && track === undefined) return;

    //if we dont pass in a track and there is a current track, play current
    if(track){

      //If this IAudioTrack is not currently in the tracks array, add it.
      if(this._tracks.indexOf(track) < 0) {

        this.add(track);

      }

      if(track !== this._current) {

        //pause current track since it is not the track that was passed in.
        if (this._current !== undefined) this.stop();

        //reassign to new src and set new current track
        this._audio.src = track.src;
        this._current = track;

      }
    }

    //(Loads and) plays audio
    this._audio.seekTo(this._current.progress);
    this._audio.subscribe(this._current);
    this._audio.play();
    this._current.isPlaying = true;

  }

  /*
   * Pause current track.
   */
  pause() {
    if(this._audio.src === undefined ) return;
    //save off progress of this track to our AudioTrack Object
    this._audio.pause();
    this._current.isPlaying = false;
  }


  /*
   * Stop current track
   * */
  stop() {
    if(this._audio.src === undefined ) return;
    this._audio.unsubscribe();
    this._audio.stop();
    this._current.isPlaying = false;
    this._current.isLoading = false;
  }

  /*
  * Seeks to location in current playing audio track
  * */
  seekTo(time: number) {
    this._audio.seekTo(time);
    this._current.progress = time;
  }

  /*
  * TODO: No Use case for this quite yet...
  * */
  destroy(track?: IAudioTrack) {}

  /*
  * Getters for private
  * */
  get currentAudio(): HTMLAudioElement | MediaPlugin { return this._audio.audio; }

  get tracks(): IAudioTrack[] { return this._tracks; }

  get current(): IAudioTrack { return this._current; }

  getDuration(): number {
    return this._audio.duration;
  }


  /*
  * Private Helper Functions
  * */

}

/*
* Web Audio Player class which creates single HTMLAudioElement to use in super class
* */
@Injectable()
export class WebAudioPlayer extends AudioPlayer {

  constructor(private webAudio: WebAudioTrack) {
    super(webAudio);
    console.log('Using Web Audio Player');
  }
}

/*
 * Web Audio Player class which creates single HTMLAudioElement to use in super class
 * */
@Injectable()
export class CordovaAudioPlayer extends AudioPlayer {

  constructor(private cordovaAudio: CordovaAudioTrack) {
    super(cordovaAudio);
    console.log('Using Cordova Audio Player');
  }
}
