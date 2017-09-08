import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {IAudioTrack} from "../../../../../dist/audio-player/audio-player-interfaces";
import {Http} from "@angular/http";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  public myTracks: IAudioTrack;
  public title: string;

  constructor(public navCtrl: NavController, private http: Http) {
    this.http.get('../assets/data/replyall.json')
      .map(res => res.json())
      .subscribe((data) => {
          this.myTracks = data.rss.channel.item.map(item => {
            return {
              src: item.content._url,
              artist: item.author.__text,
              title: item.title,
              art: data.rss.channel.thumbnail._url,
              description: item.description,
              pubDate: item.pubDate
            }
          });
          this.title = data.rss.channel.title;
        },
        err => console.log(err));
  }

  ngOnInit() {

  }

}
