/**
 * Created by jeremydejno on 2/2/17.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

//audio-player local imports
import {AudioPlayerComponent} from './audio-player.component';
import {AudioTrackComponent} from './audio-player-track.component';
import {AudioTrackPlayComponent} from './audio-player-track-play.component';
import {AudioTimePipe} from './audio-player-time-pipe';
import {AudioTrackProgressBarComponent} from './audio-player-progress-bar';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule  ],
  declarations: [
    AudioPlayerComponent,
    AudioTrackComponent,
    AudioTrackPlayComponent,
    AudioTimePipe,
    AudioTrackProgressBarComponent
  ],
  exports: [
    AudioPlayerComponent,
    AudioTrackComponent,
    AudioTrackPlayComponent,
    AudioTimePipe,
    AudioTrackProgressBarComponent
  ],
  providers: [
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AudioPlayerModule {}

export * from './audio-player-interfaces';
export * from './audio-player';
export * from './audio-player.component';
export * from './audio-player-web-track';
export * from './audio-player-track.component';
export * from './audio-player-track-play.component';
export * from './audio-player-progress-bar';
export * from './audio-player-time-pipe';

