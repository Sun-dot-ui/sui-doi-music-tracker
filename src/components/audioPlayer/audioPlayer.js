import React, { useState, useRef, useEffect, useCallback } from "react";
import "./audioPlayer.css";
import Controls from "./controls";
import WaveAnimation from "./waveAnimation";

export default function AudioPlayer({
  currentTrack,
  currentIndex,
  setCurrentIndex,
  total,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  const audioRef = useRef(null);
  const intervalRef = useRef();
  const isReady = useRef(false);

  // Stable next/prev handlers using useCallback so they never go stale in closures
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < total.length - 1 ? prev + 1 : 0));
  }, [total.length, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? total.length - 1 : prev - 1));
  }, [total.length, setCurrentIndex]);

  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!audioRef.current) return;
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  }, [handleNext]);

  
  useEffect(() => {
    const audioSrc = total[currentIndex]?.track?.preview_url;

    // Tear down the old audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    clearInterval(intervalRef.current);
    setTrackProgress(0);

    if (!audioSrc) {
      // No preview available for this track
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    if (isReady.current) {
      audio.play().then(() => {
        setIsPlaying(true);
        startTimer();
      }).catch((err) => {
        console.warn("Playback failed:", err);
        setIsPlaying(false);
      });
    } else {
      // Don't autoplay on first mount
      isReady.current = true;
    }
  }, [currentIndex, total, startTimer]);

  // Play / pause toggle
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Playback failed:", err);
        setIsPlaying(false);
      });
      startTimer();
    } else {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    }
  }, [isPlaying, startTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      clearInterval(intervalRef.current);
    };
  }, []);

  const addZero = (n) => (n > 9 ? "" + n : "0" + n);

  const artists = currentTrack?.album?.artists?.map((a) => a.name) || [];

  const hasPreview = !!total[currentIndex]?.track?.preview_url;

  return (
    <div className="player-body flex">
      <div className="player-left-body">
        <img
          src={currentTrack?.album?.images?.[0]?.url}
          alt="album art"
          className="player-album-art"
        />
      </div>

      <div className="player-right-body flex">
        <p className="song-title">{currentTrack?.name}</p>
        <p className="song-artist">{artists.join(" | ")}</p>

        {!hasPreview && (
          <p className="no-preview-msg">No preview available for this track</p>
        )}

        <div className="player-right-bottom flex">
          <div className="song-duration flex">
            <p className="duration">0:{addZero(Math.round(trackProgress))}</p>
            <WaveAnimation isPlaying={isPlaying} />
            <p className="duration">0:30</p>
          </div>

          <Controls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            handleNext={handleNext}
            handlePrev={handlePrev}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}