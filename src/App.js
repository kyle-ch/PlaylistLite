import React, { Component } from 'react';
import './App.css';
import PlaylistLite from './PlaylistLite'


class App extends Component {
  render() {
    return (
      <div>
        <div className="FlexContainer">
          <div className="Title">
            <h1 className="Title">Playlist LITE </h1>
            <p>Made by <a href='http://kylechan.me'>Kyle Chan</a></p>
          </div>
          <PlaylistLite className="PlaylistLite"/>
        </div>
      </div>

    );
  }
}

export default App;
