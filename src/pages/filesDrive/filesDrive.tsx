import React from "react";
import TabsNav from "../../components/tabsNavigation/tabs";
import "./filesDrive.css";
import FolderIcon from "@mui/icons-material/Folder";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function FileDrive() {
  return (
    <div className="fileDrive-page">
      <TabsNav></TabsNav>
      <div className="line"></div>
      <div className="fileDrive-container">
        <div className="depName">R&D</div>
        <div className="sb-search">
          <IconButton>
            <SearchIcon
              style={{ color: "white", marginLeft: "auto" }}
            ></SearchIcon>
          </IconButton>
          <input placeholder="search for file" className="search-box"></input>
        </div>
      </div>
      <div className="folders-container">
        <div className="folder-item">
          <FolderIcon
            style={{ color: "yellow", fontSize: "3rem" }}
          ></FolderIcon>
          <div style={{ fontFamily: "Arial", color: "white" }}>Full-stack</div>
        </div>
        <div className="folder-item">
          <FolderIcon
            style={{ color: "yellow", fontSize: "3rem" }}
          ></FolderIcon>
          <div style={{ fontFamily: "Arial", color: "white" }}>Full-stack</div>
        </div>
      </div>
    </div>
  );
}
