import React, { Component } from 'react';
import './App.css';

const SCOPE = 'user-library-modify user-library-read playlist-modify-public playlist-modify-private'

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

  componentDidMount() {
    this.fetchPlaylists();
  }

  fetchPlaylists() {
    if (this.state.access_token) {
      fetch("https://api.spotify.com/v1/me/playlists", {
        method:"GET",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.state.access_token
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
        }
      )
      .then((json) => {
        this.setState({playlists: json.items});
      })
      .catch((e) => {
        console.log(e);
        this.clearToken();
      });
    }
  }

  fetchTracks(url) {
    return fetch(url, {
      method:"GET",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.access_token
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
      }
    )
    .then((json) => {
      return json;
    })
    .catch((e) => {
      console.log(e);
      this.clearToken();
    });
  }

  async composePlaylist(playlist, tracks) {
    var liteVersion = this.liteVersion(playlist);
    if (!liteVersion) {
      liteVersion = await this.makeNewPlaylist(playlist, tracks);
    }
    fetch(liteVersion.href + "/tracks", {
      method: "PUT",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.access_token
      },
      body: JSON.stringify({
        uris: tracks
      })
    })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
      }
    )
    .then((json) => {
      return json;
    }).then(
      this.fetchPlaylists()
    )
    .catch((e) => {
      console.log(e);
    });
  }

  makeNewPlaylist(playlist, tracks) {
    return fetch("https://api.spotify.com/v1/users/" + playlist.owner.id + "/playlists", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.access_token
      },
      body: JSON.stringify({
        name: playlist.name + " Lite",
        description: playlist.title + " Lite'nd by PlaylistLite\n"
      })
    })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
      }
    )
    .then((json) => {
      return json;
    })
    .catch((e) => {
      console.log(e);
      this.clearToken();
    });
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
    let newTracks = await this.fetchTracks(playlist.tracks.href);
    tracks = tracks.concat(newTracks.items);
    while (newTracks.next) {
      newTracks = await this.fetchTracks(newTracks.next);
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
    if (numTracks > len)
        numTracks = Math.floor(len/2);
        result = new Array(numTracks);
    while (numTracks--) {
        var x = Math.floor(Math.random() * len);
        result[numTracks] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }


  render() {
    let loginURL = 'https://accounts.spotify.com/authorize?client_id='+ process.env.REACT_APP_PLAYLIST_LITE_CLIENT_ID +'&response_type=token&scope=' + SCOPE + '&redirect_uri=' + window.location.href
    var logIn = (
      <div>
        <a href={loginURL}>
          Login
        </a>
        <p> with your Spotify account </p>
      </div>);
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
          {logIn}
        </div>
      )

    return content;
  }
}

export default PlaylistLite;
