import React, { useState, useEffect } from "react";
import apiClient from "../../spotify";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import "./library.css";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const [playlists, setPlaylists] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("me/playlists?limit=50")
      .then((response) => {
        console.log("playlists:", response.data.items);
        setPlaylists(response.data.items);
      })
      .catch((err) => console.error("Library error:", err));
  }, []);

  const playPlaylist = (id) => {
    navigate("/player", { state: { id } });
  };

  return (
    <div className="screen-container">
      <div className="library-body">
        {playlists?.map((playlist) => (
          <div
            className="playlist-card"
            key={playlist.id}
            onClick={() => playPlaylist(playlist.id)}
          >
            <img
              src={playlist.images?.[0]?.url || "https://via.placeholder.com/300"}
              className="playlist-image"
              alt="Playlist-Art"
            />
            <p className="playlist-title">{playlist.name}</p>
            <p className="playlist-subtitle">
            {playlist.items?.total ?? playlist.tracks?.total ?? "?"} Songs
            </p>
            <div className="playlist-fade">
              <IconContext.Provider value={{ size: "50px", color: "#E99D72" }}>
                <AiFillPlayCircle />
              </IconContext.Provider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



/*import React, { useState, useEffect } from "react";
import apiClient from "../../spotify";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import "./library.css";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const [playlists, setPlaylists] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("me/playlists")
      .then((response) => {
        setPlaylists(response.data.items);
      })
      .catch((err) => console.error("Library error:", err));
  }, []);

  const playPlaylist = (id) => {
    navigate("/player", { state: { id } });
  };

  return (
    <div className="screen-container">
      <div className="library-body">
        {playlists?.map((playlist) => (
          <div
            className="playlist-card"
            key={playlist.id}
            onClick={() => playPlaylist(playlist.id)}
          >
            <img
              src={playlist.images?.[0]?.url || "https://via.placeholder.com/300"}
              className="playlist-image"
              alt="Playlist-Art"
            />
            <p className="playlist-title">{playlist.name}</p>
            <p className="playlist-subtitle">
              {playlist.tracks?.total ?? 0} Songs
            </p>
            <div className="playlist-fade">
              <IconContext.Provider value={{ size: "50px", color: "#E99D72" }}>
                <AiFillPlayCircle />
              </IconContext.Provider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}*/