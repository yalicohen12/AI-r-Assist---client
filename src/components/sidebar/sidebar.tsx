import React, { useEffect, useState } from "react";
import "./sidebar.css";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ConversationItem from "../conversationItem/conversationItem";
import AddIcon from "@mui/icons-material/Add";
import { getConversations } from "../../services/apis/conversationsAPI";
import { useAppDispatch, useAppSelector } from "../../state";
import { set, newConversation } from "../../state/conversationState";
import LogoutIcon from "@mui/icons-material/Logout";

interface ConversationProps {
  title: string;
  timestamp: string;
  conversationID: string;
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.authSlice.isAuth);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);
  useEffect(() => {
    const fetchConversations = async () => {
      if (localStorage.getItem("userID")) {
        try {
          const conversationsHistory = await getConversations();
          setConversations(conversationsHistory);
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      }
    };

    if (!conversations.length) {
      fetchConversations();
    }
  }, [conversations, authStatus]);

  function deleteConversationCall(conID: string) {
    setConversations((prevConversations) =>
      prevConversations.filter((c) => c.conversationID !== conID)
    );

    if (localStorage.getItem("conversationID") === conID) {
      dispatch(newConversation());
      localStorage.setItem("conversationID", "");
    }
  }

  useEffect(() => {
    if (authStatus == false) {
      setConversations([]);
    }
  }, [authStatus]);
  function handlenewConversation() {
    dispatch(newConversation());
    localStorage.setItem("conversationID", "");
  }
  return (
    <div className="sidebar-container">
      <div className="sb-head">
        <IconButton>
          <img
            src={process.env.PUBLIC_URL + "/img/Bamza_108.png"}
            className="img108"
            alt="Bamza 108"
          />
        </IconButton>
        <div className="pro-name"> AI-r Assist</div>
        {/* {localStorage.getItem("userName") && (
          <div className="pro-username">
            {" "}
            hello {localStorage.getItem("userName")}
          </div>
        )} */}
      </div>
      <div className="sb-new" onClick={handlenewConversation}>
        <IconButton>
          <AddIcon></AddIcon>
        </IconButton>
        <div>New Chat</div>
      </div>
      {authStatus && <div className="sb-search">
        <IconButton>
          <SearchIcon style={{ color: "white" }}></SearchIcon>
        </IconButton>
        <input placeholder="search" className="search-box"></input>
      </div>}
      <div className="sb-conversations">
        {conversations.map((conversation) => {
          return (
            <ConversationItem
              key={conversation.conversationID}
              title={conversation.title}
              timeStamp={conversation.timestamp.split("T")[0]}
              conversationID={conversation.conversationID}
              deleteConversationCall={deleteConversationCall}
            />
          );
        })}
      </div>
      {/* {authStatus && (
              <div className="container-logout">
                <div className="logTxt"> Logout</div>
                <LogoutIcon
                  // onClick={handleLogout}
                  className="logouticon"
                  color="primary"
                ></LogoutIcon>
              </div>
              
            )} */}
    </div>
  );
}
