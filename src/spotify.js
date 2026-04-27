import axios from 'axios';

const authEndpoint = "https://accounts.spotify.com/authorize";
const clientID = "e8404480df034ccb95e201cd499a88b4";
const redirectUri = "https://d1za3dob4ytow2.cloudfront.net";

const scopes = [
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-top-read",
];


const generateCodeVerifier = () => {
  const array = new Uint32Array(56);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
};


const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

export const redirectToLogin = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  window.localStorage.setItem("code_verifier", codeVerifier);

  const url = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  window.location.href = url;
};

export const getToken = async (code) => {
  const codeVerifier = window.localStorage.getItem("code_verifier");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientID,
      code_verifier: codeVerifier,
    }),
  });

  const data = await response.json();
  if (data.error) {
    console.error("Spotify token error", data);
    return null;
  }
  window.localStorage.setItem("token", data.access_token);
  window.localStorage.setItem("refresh_token", data.refresh_token);
  window.localStorage.setItem("expires_in", data.expires_in);

  return data.access_token;
};

const apiClient = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

export const setClientToken = (token) => {
  apiClient.interceptors.request.use(async function(config) {
    config.headers.Authorization = "Bearer " + token;
    return config;
  });
};

export default apiClient;