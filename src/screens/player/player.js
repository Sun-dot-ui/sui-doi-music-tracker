import React, { useEffect, useState } from "react";
import "./player.css";
import { useLocation } from "react-router-dom";
import apiClient from "../../spotify";
import SongCard from "../../components/songCard/songCard";
import Queue from "../../components/queue/queue";
import AudioPlayer from "../../components/audioPlayer/audioPlayer";
import Widgets from "../../components/widgets/widgets";

export default function Player() {
  const location = useLocation();

  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log("TRACKS:", tracks);
  console.log("FIRST TRACK:", tracks[0]);
  console.log("PREVIEW URL:", tracks[0]?.track?.preview_url);

  
  useEffect(() => {
    const playlistId = location.state?.id;
    if (!playlistId) return;

    apiClient
      .get(`playlists/${playlistId}/tracks`)
      .then((res) => {
        const items = res.data.items || [];
        setTracks(items);
        setCurrentTrack(items[0]?.track || null);
      })
      .catch((err) => console.error("Player fetch error:", err));
  }, [location.state]);


  useEffect(() => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[currentIndex]?.track);
    }
  }, [currentIndex, tracks]);

  return (
    <div className="screen-container flex">
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
        <Queue tracks={tracks} setCurrentIndex={setCurrentIndex} />
      </div>
    </div>
  );
}
