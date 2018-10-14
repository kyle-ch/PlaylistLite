import React, { Component } from 'react';
import './App.css';
import PlaylistLite from './PlaylistLite'


class App extends Component {
  render() {
    return (
      <div>
        <div className="FlexContainer">
          <h1 className="Title">Playlist LITE </h1>
          <PlaylistLite className="PlaylistLite"/>
        </div>
      </div>

    );
  }
}

export default App;
