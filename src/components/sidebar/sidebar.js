import React, { useState, useEffect } from "react";
import "./sidebar.css";
import SidebarButton from './sidebarButton';
import { BsFillMusicPlayerFill } from "react-icons/bs";
import { HiBuildingLibrary } from "react-icons/hi2";
import { FaSignOutAlt } from "react-icons/fa";
import apiClient from '../../spotify';

export default function Sidebar() {
  const [image, setImage] = useState(
    "https://screamsofabanana.wordpress.com/wp-content/uploads/2020/06/gintoki-umbrella-1.jpg?w=1024"
  );

  useEffect(() => {
    apiClient.get("me")
      .then((response) => {
        if (response.data.images?.length > 0) {
          setImage(response.data.images[0].url);
        }
      })
      .catch(() => console.warn("Could not load profile image"));
  }, []);

  const signOut = () => {
    window.localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="sidebar-container">
      <img src={image} className="profile-image" alt="profile" />
      <div>
        <SidebarButton title="Library" to="/library" icon={<HiBuildingLibrary />}/>
        <SidebarButton title="Player" to="/player" icon={<BsFillMusicPlayerFill />}/>
      </div>
      <div onClick={signOut} style={{cursor:"pointer"}}>
        <SidebarButton title="Sign Out" to="" icon={<FaSignOutAlt />}/>
      </div>
    </div>
  );
}