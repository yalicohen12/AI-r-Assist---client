import React, { useEffect, useState } from "react";
import "./tabs.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state";
import { setPage } from "../../state/pageState";
import { toast } from "react-toastify";

function TabsNav() {
  const navigate = useNavigate();
  const currentPage = useAppSelector((state) => state.pageSlice.page);
  const dispatch = useAppDispatch();

  const authStatus = useAppSelector((state) => state.authSlice.isAuth);

  const notifyStreamingWait = () => {
    toast.info("please wait until message will finish load", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "dark",
    });
  };

  const notifyLoginFirst = () => {
    toast.info("you must be logged in to view this page", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "dark",
    });
  };

  const isStreaming = useAppSelector(
    (state) => state.streamingSlice.isStreaming
  );

  const handleTabClick = (tabName: string) => {
    if (!isStreaming) {
      // dispatch(setPage(tabName));
      if (tabName == "Chat") {
        navigate("/");
        dispatch(setPage(tabName));
      } else {
        if (tabName == "User") {
          if (authStatus) {
            navigate(`/${tabName.toLowerCase()}`);
            dispatch(setPage(tabName));
          } else {
            notifyLoginFirst();
          }
        } else {
          navigate(`/${tabName.toLowerCase()}`);
          dispatch(setPage(tabName));

        }
      }
    } else {
      notifyStreamingWait();
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
        {/* <div
          className={currentPage === "User" ? "active-tab" : "tab"}
          onClick={() => handleTabClick("User")}
        >
          User
        </div> */}
      </div>
    </div>
  );
}

export default TabsNav;
