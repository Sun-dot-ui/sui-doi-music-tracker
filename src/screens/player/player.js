import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./player.css";
import apiClient from "../../spotify";
import SongCard from "../../components/songCard/songCard";
import Queue from "../../components/queue/queue";
import AudioPlayer from "../../components/audioPlayer/audioPlayer";
import Widgets from "../../components/widgets/widgets";

export default function Player() {
  const location = useLocation();
  const navigate = useNavigate();

  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const playlistId = location.state?.id;
    if (!playlistId) return;

    setLoading(true);
    apiClient
      .get(`playlists/${playlistId}/tracks`)
      .then((res) => {
        const items = res.data.items || [];
        setTracks(items);
        setCurrentTrack(items[0]?.track || null);
        setCurrentIndex(0);
      })
      .catch((err) => console.error("Player fetch error:", err))
      .finally(() => setLoading(false));
  }, [location.state]);

  useEffect(() => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[currentIndex]?.track || null);
    }
  }, [currentIndex, tracks]);

  if (!location.state?.id) {
    navigate("/library");
    return null;
  }

  if (loading) {
    return (
      <div className="screen-container flex">
        <p style={{ color: "#9aa9c2", margin: "auto" }}>Loading tracks…</p>
      </div>
    );
  }

  return (
    <div className="screen-container flex player-screen">
      <div className="left-player-body">
        {currentTrack && (
          <AudioPlayer
            currentTrack={currentTrack}
            total={tracks}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        )}
        {currentTrack?.album?.artists?.[0]?.id && (
          <Widgets artistID={currentTrack.album.artists[0].id} />
        )}
      </div>

      <div className="right-player-body">
        {currentTrack?.album && <SongCard album={currentTrack.album} />}
        <Queue
          tracks={tracks}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </div>
  );
}