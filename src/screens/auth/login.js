import React from "react";
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
}
