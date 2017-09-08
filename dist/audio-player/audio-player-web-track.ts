/**
 * Created by jeremydejno on 2/3/17.
 */
import {Injectable, Optional} from "@angular/core";
import {BehaviorSubject, AsyncSubject} from 'rxjs';
import {IAudioTrack} from './audio-player-interfaces';



/**
 * Creates an HTML5 audio track
 *
 * @export
 * @class WebAudioTrack
 * @constructor
 * @implements {IAudioTrack}
 */
@Injectable()
export class WebAudioTrack implements IAudioTrack {
  private _audio: HTMLAudioElement;
  public isPlaying: boolean = false;

  private _hasLoaded: boolean = false;
  private _progress: BehaviorSubject<number>;
  private _duration: AsyncSubject<number>;
  private _ended: BehaviorSubject<boolean>;
  private _isLoading: BehaviorSubject<boolean>;

  constructor(@Optional() private _src?: string) {
    this.create();
    this._ended = new BehaviorSubject<boolean>(false);
    this._progress = new BehaviorSubject<number>(0);
    this._duration = new AsyncSubject<number>();
    this._isLoading  = new BehaviorSubject<boolean>(false);
  }


  private create() {
    this._audio = new Audio(this.src);
    this._audio.preload = 'metadata';

    this._audio.addEventListener("loadstart", (ev) => {
      if (!this._audio.seeking) console.log(`Loading track ${this.src}`);
      this._isLoading.next(true);
      this._hasLoaded = false;
    });

    this._audio.addEventListener("loadedmetadata", (ev) => {
      //let subscribers know duration of track when loaded
      this._duration.next(this._audio.duration);
      this._duration.complete();

    });

    this._audio.addEventListener("canplay", (ev) => {
      if (!this._hasLoaded) {
        console.log(`Loaded track ${this.src}`);
        this._hasLoaded = true
        this._isLoading.next(false);
      }
    });

    this._audio.addEventListener("playing", (ev) => {
      console.log(`Playing ${this.src}`);
      this.isPlaying = true;
    });

    this._audio.addEventListener("timeupdate", (ev) => {
      this.onTimeUpdate(ev);
    });

    this._audio.addEventListener("ended", (ev) => {
      console.log(`Finished ${this.src}`);
      this.isPlaying = false;
      //on track finish, let subscribers know track is finished.
      //this._ended.next(true);
    });

    this._audio.addEventListener("abort", (ev) => {
      console.log(`Stopped Track`);
      this.isPlaying = false;
    });

  }

  /*
  * sends progress data to all current subscribers
  * */
  private onTimeUpdate(e: Event) {
    if (this.isPlaying && this._audio.currentTime > 0) {
      this._progress.next(this._audio.currentTime);
    }
  }

  public play() {
    if(!this._audio.src) {
      console.error('Tried to play undefined track.');
      return;
    }

    this._audio.play();
  }

  /**
   * Pauses current track
   *
   * @method pause
   */
  pause() {
    if (!this.isPlaying) return;
    console.log(`Pausing track ${this.src}`);
    this._audio.pause();
    this.isPlaying = false;
  }

  /*
  * Seeks to location in track.
  * Lets subscribers know new track progress location
  * */
  seekTo(time: number) {
    if(time === undefined) time = 0;
    this._progress.next(time);
    this._audio.currentTime = time;
  }

  stop() {
    this.pause();
  }

  destroy() {}

  /*
  * Subscribe to Progress and Duration of current playing.
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

  //Unsubscribe to Progress.
  public unsubscribe() {
    //for AsyncDuration, need to unsubscribe previous Observer and then create new instance so 'load aborted' track
    //does not get the wrong duration.
    this._duration.unsubscribe();
    this._duration = new AsyncSubject<number>();
    this._progress.complete();
    this._isLoading.complete();
  }

  /*
   * Getters for private properties
   */
  //returns HTMLAudioElement
  get audio() { return this._audio }

  //returns duration of audio track.
  get duration() {return this._audio.duration}

  //AsyncSubject to subscribe to track ending
  get ended() { return this._ended }

  //Set HTMLAudioElement source and private src variable
  set src(source: string) {
    this._src = source;
    this._audio.src = this._src;
  }

  //get private src variable
  get src() { return this._src; }
}
