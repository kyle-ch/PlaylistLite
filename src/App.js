import React, { Component } from 'react';
import './App.css';
import PlaylistLite from './PlaylistLite'
import Description from './Description'

class App extends Component {
  render() {
    return (
      <div>
        <div className="FlexContainer">
          <div className="title-box">
            <h1 className="title">Playlist LITE </h1>
            <p>Made by <a href='http://kylechan.me'>Kyle Chan</a></p>
            <Description/>
          </div>
          <PlaylistLite className="PlaylistLite"/>
        </div>
      </div>

    );
  }
}

export default App;
