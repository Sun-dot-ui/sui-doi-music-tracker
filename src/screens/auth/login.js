import React from "react";
import { redirectToLogin } from "../../spotify";
import "./login.css";

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-card">

        {/* Ambient background blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        {/* App name */}
        <div className="login-brand">
          <h1 className="login-title">SANGEET</h1>
          <div className="login-powered">
            <span>powered by</span>
            <img
              src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
              alt="Spotify"
              className="spotify-mini-logo"
            />
            <span>Spotify</span>
          </div>
        </div>

        {/* Login button */}
        <button className="login-btn" onClick={redirectToLogin}>
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
            alt=""
            className="btn-logo"
          />
          Continue with Spotify
        </button>

      </div>
    </div>
  );
}


/**import React from "react";
import { redirectToLogin } from '../../spotify';
import "./login.css";

export default function Login() {
  return (
    <div className="login-page">
       <img 
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
        alt="logo-spotify"
        className="logo" 
        />
          <div className="login-btn" onClick={redirectToLogin}>LOG IN</div>
    </div>
  );
}*/