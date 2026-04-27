import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from '../../components/sidebar/sidebar';
import { setClientToken, getToken } from "../../spotify";
import Login from '../auth/login';
import Favorites from '../favorites/favorites';
import Player from '../player/player';
import Library from '../library/library';
import './home.css';

export default function Home() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !storedToken) {
      getToken(code).then((_token) => {
        if (_token) {
          setToken(_token);
          setClientToken(_token);
          window.history.replaceState({}, document.title, "/");
        }
      });
    } else if (storedToken) {
      setToken(storedToken);
      setClientToken(storedToken);
    }
  }, []);

  return (
    <Router>
      {!token ? (
        <Login />
      ) : (
        <div className="main-body">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Library />} />
              <Route path="/player" element={<Player />} />
              <Route path="/library" element={<Library />} />
              <Route path="/favourites" element={<Favorites />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}