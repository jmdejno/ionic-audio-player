/**
 * Created by jeremydejno on 2/5/17.
 */
import {IAudioTrack} from './audio-player-interfaces';
import {Injectable, Optional} from '@angular/core';
import {BehaviorSubject, AsyncSubject} from 'rxjs';
import {MediaPlugin} from 'ionic-native';

declare let Media: any;

/**
 * Cordova Media audio track
 *
 * @export
 * @class CordovaAudioTrack
 * @constructor
 * @implements {IAudioTrack}
 */
@Injectable()
export class CordovaAudioTrack implements IAudioTrack {
  private _audio: MediaPlugin;
  public isPlaying: boolean = false;
  private _isLoading: BehaviorSubject<boolean>;
  private _hasLoaded: boolean;
  private _progress: BehaviorSubject<number>;
  private _duration: AsyncSubject<number>;
  private _ended: BehaviorSubject<boolean>;
  private _timer: any;

  constructor(@Optional() private _src?: string) {
    if (window['cordova'] === undefined || window['Media'] === undefined) {
      console.log('Cordova Media is not available');
      return;
    }

    if(this.src !== undefined) this.createAudio();

    this._ended = new BehaviorSubject<boolean>(false);
    this._progress = new BehaviorSubject<number>(0);
    this._duration = new AsyncSubject<number>();
    this._isLoading = new BehaviorSubject<boolean>(false);

  }

  private createAudio() {
    this._audio = new Media(this._src, () => {
      console.log('Finished playback');
      this.stopTimer();
      this._ended.next(true);
      this.destroy();  // TODO add parameter to control whether to release audio on stop or finished
    }, (err: MediaError) => {
      console.log(`Audio error => track ${this._src}`, err);
    }, (status) => {
      switch (status) {
        case Media.MEDIA_STARTING:
          console.log(`Loaded track ${this._src}`);
          this._hasLoaded = true;
          break;
        case Media.MEDIA_RUNNING:
          console.log(`Playing track ${this._src}`);
          this.isPlaying = true;
          this._isLoading.next(false);
          break;
        case Media.MEDIA_PAUSED:
          this.isPlaying = false;
          break;
        case Media.MEDIA_STOPPED:
          this.isPlaying = false;
          break;
      }
    });
  }

  private startTimer() {
    this._timer = setInterval(() => {
      if (this._audio.getDuration() > -1) {
        this._duration.next(Math.round(this._audio.getDuration()*100)/100);
        this._duration.complete();
      }

      this._audio.getCurrentPosition().then((position) => {
          if (position > -1) {
            this._progress.next(Math.round(position*100)/100);
          }
        }, (e) => {
          console.log("Error getting position", e);
        }
      );
    }, 1000);
  }

  private stopTimer() {
    clearInterval(this._timer);
  }

  /** Public Members **/

  /**
   * Plays current track
   *
   * @method play
   */
  play() {
    if (!this._audio) {
      this.createAudio();
    }

    if (!this._hasLoaded) {
      console.log(`Loading track ${this._src}`);
      this._isLoading.next(true);
      this._hasLoaded = false;
    }

    this._audio.play();
    this.startTimer();
  }

  /**
   * Pauses current track
   *
   * @method pause
   */
  pause() {
    if (!this.isPlaying) return;
    console.log(`Pausing track ${this._src}`);
    this._audio.pause();
    this.stopTimer();
  }

  /**
   * Stops current track and releases audio
   *
   * @method stop
   */
  stop() {
    this._audio.stop();  // calls Media onSuccess callback
  }

  /**
   * Seeks to a new position within the track
   *
   * @method seekTo
   * @param {number} time the new position (milliseconds) to seek to
   */
  seekTo(time: number) {
    // Cordova Media reports duration and progress as milliseconds, so we need to multiply by 1000
    this._audio.seekTo(time*1000);
  }

  /**
   * Releases audio resources
   *
   * @method destroy
   */
  destroy() {
    this._audio.release();
    console.log(`Released track ${this._src}`);
  }

  /*
   * Subscribe to Progress, Duration, and isLoading of current playing.
   * When Subject completes (after track stops [progress] or metadata loads [duration],
   * create a new Subject to be subscribed to for next track
   */
  public subscribe(track: IAudioTrack) {
    this._progress.subscribe({
      next: (val) => {
        track.progress = val;
      },
      error: (error) => {console.error(error)},
      complete: () => {
        this._progress = new BehaviorSubject<number>(0);
      }
    });
    this._duration.subscribe({
      next: (val) => {
        track.duration = val;
      },
      error: (error) => {console.error(error)},
      complete: () => {
        this._duration = new AsyncSubject<number>()
      }
    });
    this._isLoading.subscribe({
      next: (val) => {
        track.isLoading = val;
      },
      error: (err) => {console.log(err)},
      complete: () => {
        this._isLoading = new BehaviorSubject<boolean>(false)
      }
    })
  }

  //Unsubscribe to Progress and isLoading.
  public unsubscribe() {
    //for AsyncDuration, need to unsubscribe previous Observer and then create new instance so 'load aborted' track
    //does not get the wrong duration.
    this._duration.unsubscribe();
    this._duration = new AsyncSubject<number>();
    this._progress.complete();
    this._isLoading.complete();
  }

  /*
  * Private Getters
  * */

  set src(source: string) { this._src = source; }

  get audio(): MediaPlugin { return this._audio }

  get duration(): number { return this._audio.getDuration() }

}
