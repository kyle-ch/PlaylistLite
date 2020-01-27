import React from 'react';
import '../App.css';

const SCOPE = 'user-library-modify user-library-read playlist-modify-public playlist-modify-private'
const loginURL = 'https://accounts.spotify.com/authorize?client_id='+ process.env.REACT_APP_PLAYLIST_LITE_CLIENT_ID +'&response_type=token&scope=' + SCOPE + '&redirect_uri=' + window.location.href

const Login = () => (
  <div>
    <a href={loginURL}>
      Login
    </a>
    <p> with your Spotify account </p>
  </div>
);

export default Login;
