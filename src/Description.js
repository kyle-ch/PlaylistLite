import React, { Component } from 'react';
import './App.css';

class Description extends Component {
  render() {
    return (
      <div>
        <p>Here you can manage your excessively large playlists and create lite
        versions so that you can download them on your device without using up
        all of your precious storage.</p>
        <p>Enter the amount of songs you want in your <b>LITE</b> playlist and
        hit the button next to the playlist you want to lighten. If a <b>LITE </b>
        playlist doesn't exist for that playlist yet, it'll create one for it. Otherwise,
        it will update the existing <b>LITE</b> playlist with a new sample of songs.</p>
      </div>

    );
  }
}

export default Description;
