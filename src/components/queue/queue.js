import React, { useState, useMemo } from "react";
import "./queue.css";
import { IconContext } from "react-icons";
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";

export default function Queue({ tracks, currentIndex, setCurrentIndex }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [likedTracks, setLikedTracks] = useState(new Set());

  const toggleLike = (e, trackId) => {
    // Prevent click from also selecting the track
    e.stopPropagation();
    setLikedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  };

  // Filter tracks by search query, keeping original index for setCurrentIndex
  const filteredTracks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tracks.map((t, i) => ({ track: t, originalIndex: i }));

    return tracks
      .map((t, i) => ({ track: t, originalIndex: i }))
      .filter(({ track }) => {
        const name = track?.track?.name?.toLowerCase() || "";
        const artists =
          track?.track?.artists?.map((a) => a.name.toLowerCase()).join(" ") ||
          "";
        return name.includes(q) || artists.includes(q);
      });
  }, [tracks, searchQuery]);

  return (
    <IconContext.Provider value={{ size: "16px" }}>
      <div className="queue-container flex">
        <div className="queue flex">

          {/* Header row */}
          <div className="queue-header flex">
            <p className="upNext">Up Next</p>
            <span className="track-count">{tracks.length} tracks</span>
          </div>

          {/* Search bar */}
          <div className="search-wrapper flex">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search songs or artists…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Track list */}
          <div className="queue-list">
            {filteredTracks.length === 0 ? (
              <p className="no-results">No tracks match "{searchQuery}"</p>
            ) : (
              filteredTracks.map(({ track, originalIndex }) => {
                const trackId =
                  track?.track?.id || track?.track?.name + originalIndex;
                const isLiked = likedTracks.has(trackId);
                const isActive = originalIndex === currentIndex;

                return (
                  <div
                    key={trackId}
                    className={`queue-item flex${isActive ? " queue-item--active" : ""}`}
                    onClick={() => setCurrentIndex(originalIndex)}
                  >
                    <div className="queue-item-info flex">
                      {isActive && <span className="now-playing-dot" />}
                      <div className="queue-item-text">
                        <p className="track-name">{track?.track?.name}</p>
                        <p className="track-artist">
                          {track?.track?.artists?.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="queue-item-right flex">
                      <p className="track-duration">0:30</p>
                      <button
                        className={`like-btn${isLiked ? " liked" : ""}`}
                        onClick={(e) => toggleLike(e, trackId)}
                        aria-label={isLiked ? "Unlike" : "Like"}
                      >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
}