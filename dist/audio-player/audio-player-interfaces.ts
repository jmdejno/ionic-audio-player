/**
 * Created by jeremydejno on 2/2/17.
 */

/*
* Defines created Audio Track
*
* @export
* @interface IAudioTrack
*/
export interface IAudioTrack {
  id?: number;
  src?: string;
  title?: string;
  artist?: string;
  art?: string;
  description?: string;
  progress?: number;
  duration?: number;
  pubDate?: string;
  isPlaying?: boolean;
  isLoading?: boolean;


  seekTo?(time: number);
  destroy?();

}

/*
* Defines Audio Player
*
* @export IAudioPlayer
* */
export interface IAudioPlayer {

  add(track: IAudioTrack): number;
  play(track?: IAudioTrack);
  pause();
  stop();
  destroy(track?: IAudioTrack);

}
