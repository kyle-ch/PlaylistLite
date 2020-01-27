const SpotifyApi = {
  fetchPlaylists : (access_token) => {
    if (access_token) {
      return fetch("https://api.spotify.com/v1/me/playlists", {
        method:"GET",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + access_token
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
        }
      )
    }
  },
  fetchTracks : (url, access_token) => {
    return fetch(url, {
      method:"GET",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
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
  },
  createPlaylist: (playlist, tracks, access_token) => {
    return fetch(playlist.href + "/tracks", {
      method: "PUT",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      },
      body: JSON.stringify({
        uris: tracks
      })
    })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
    });
  },
  makeNewPlaylist : (playlist, access_token) => {
    return fetch("https://api.spotify.com/v1/users/" + playlist.owner.id + "/playlists", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
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
  }
};
export default SpotifyApi;
