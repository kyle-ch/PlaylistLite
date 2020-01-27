import React, { Component } from 'react';
import '../App.css';
import Login from './Login.js';
import SpotifyApi from './api.js';

class PlaylistLite extends Component {
  constructor(props) {
    super(props);
    this.state = this.getHashParams();
    this.state.numTracks = 50;
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
       q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
   }

  clearToken() {
    this.setState({access_token: null});
  }

  withErrorHandling(fn) {
    try {
      return fn();
    }
    catch (e) {
      console.log(e)
      this.clearToken()
    }
  }

  componentDidMount() {
    this.fetchAndSetPlaylists()
  }

  fetchAndSetPlaylists() {
    this.withErrorHandling(() => SpotifyApi.fetchPlaylists(this.state.access_token)
    .then((json) => {
      this.setState({playlists: json.items});
    }))
  }

  fetchAndSetTracks(url) {
    return this.withErrorHandling(() => SpotifyApi.fetchTracks(url, this.state.access_token));
  }

  async composePlaylist(playlist, tracks) {
    var liteVersion = this.liteVersion(playlist);
    if (!liteVersion) {
      liteVersion = await this.makeNewPlaylist(playlist);
    }
    await SpotifyApi.createPlaylist(liteVersion, tracks, this.state.access_token);
    setTimeout(this.fetchAndSetPlaylists.bind(this), 5000)
  }

  makeNewPlaylist(playlist) {
    return this.withErrorHandling(() => SpotifyApi.makeNewPlaylist(playlist, this.state.access_token));
  }

  liteVersion(playlist) {
    var matches = this.state.playlists.filter((pl) => pl.name === (playlist.name + ' Lite'));
    if (matches.length > 0) {
      return matches[0];
    }
    else {
      return null;
    }
  }

  async lighten(playlist) {
    var tracks = [];
    let newTracks = await this.fetchAndSetTracks(playlist.tracks.href);
    tracks = tracks.concat(newTracks.items);
    while (newTracks.next) {
      newTracks = await this.fetchAndSetTracks(newTracks.next);
      tracks = tracks.concat(newTracks.items);
    }
    tracks = this.getRandom(tracks, this.state.numTracks);
    this.composePlaylist(playlist, tracks.map((track) => track.track.uri));
  }

  // from https://stackoverflow.com/a/19270021
  getRandom(arr, n) {
    var numTracks =  n ? n : 50;
    var result = new Array(numTracks),
        len = arr.length,
        taken = new Array(len);
    while (numTracks--) {
        var x = Math.floor(Math.random() * len);
        result[numTracks] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }


  render() {
    var input = (
      <div>
        <input className="input input-field" type="number" placeholder="Number of tracks" onChange={(e) => this.setState({numTracks : e.target.value})}/>
      </div>
    );
    var playlists = this.state.playlists ? (
      <table className="table is-hoverable">
        <tbody>
          <thead>
          {input}
          </thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Number of tracks</th>
            <th> </th>
          </tr>
          {this.state.playlists.map((playlist) => {
            return (
              <tr key={playlist.id}>
                <td><figure className="image is-64x64"><img src={playlist.images[0] ? playlist.images[0].url : null} alt={playlist.name} height='64'/></figure></td>
                <td>{playlist.name}</td>
                <td>{playlist.tracks.total}</td>
                <td><button className="button" onClick={this.lighten.bind(this, playlist)} disabled={this.state.numTracks >= playlist.tracks.total}>LITE</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>) : null;

      var content = this.state.access_token ? (
        <div className="PlaylistLite">
          {playlists}
        </div>
      ) : (
        <div className="PlaylistLite">
          {<Login/>}
        </div>
      )

    return content;
  }
}

export default PlaylistLite;
