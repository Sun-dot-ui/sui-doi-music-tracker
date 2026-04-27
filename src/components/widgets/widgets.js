import React, { useState, useEffect } from "react";
import "./widgets.css";
import apiClient from "../../spotify";
import WidgetCard from "./widgetCard";

export default function Widgets({ artistID }) {
  const [similar, setSimilar] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newRelease, setNewRelease] = useState([]);

  useEffect(() => {
    if (artistID) {
      apiClient
        .get(`/artists/${artistID}/related-artists`)
        .then((res) => {
          const a = res.data?.artists.slice(0, 3);
          setSimilar(a);
        })
        .catch((err) => console.error(err));

        apiClient
          .get(`/artists/${artistID}/albums?include_groups=album,single&limit=3`)
          .then((res) => setNewRelease(res.data?.items || []));

        apiClient
          .get(`/artists/${artistID}/top-tracks?market=from_token`)
          .then((res) => setFeatured(res.data?.tracks.slice(0, 3) || []));
      }
  }, [artistID]);

  return (
    <div className="widgets-body flex">
      <WidgetCard title="Similar Artists" similar={similar} />
      <WidgetCard title="Top Tracks" featured={featured} />
      <WidgetCard title="Their Albums" newRelease={newRelease} />
    </div>
  );
}