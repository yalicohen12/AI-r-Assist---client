import React, { useEffect, useState } from "react";
import "./tabs.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state";
import { setPage } from "../../state/pageState";

function TabsNav() {
  const navigate = useNavigate();
  const currentPage = useAppSelector((state) => state.pageSlice.page);
  const dispatch = useAppDispatch();

  const handleTabClick = (tabName: string) => {
    dispatch(setPage(tabName));
    if (tabName == "Chat") {
      navigate("/");
    } else {
      navigate(`/${tabName.toLowerCase()}`);
    }
  };

  return (
    <div>
      <div className="chatArea-header">
        <div
          className={currentPage === "Chat" ? "active-tab" : "tab"}
          onClick={() => handleTabClick("Chat")}
        >
          Chat
        </div>

        <div
          className={currentPage === "Files" ? "active-tab" : "tab"}
          onClick={() => handleTabClick("Files")}
        >
          Files
        </div>
        <div
          className={currentPage === "User" ? "active-tab" : "tab"}
          onClick={() => handleTabClick("User")}
        >
          User
        </div>
      </div>
    </div>
  );
}

export default TabsNav;
