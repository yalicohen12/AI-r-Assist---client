import React, { useEffect, useRef, useState } from "react";
import "./sidebar.css";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton, Tooltip } from "@mui/material";
import { AccountCircle, Height } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ConversationItem from "../conversationItem/conversationItem";
import AddIcon from "@mui/icons-material/Add";
import { getConversations } from "../../../services/apis/conversationsAPI";
import { useAppDispatch, useAppSelector } from "../../../state";
import { set, newConversation } from "../../../state/conversationState";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ConfirmModal from "../../confirmModal/confirmModal";
import { text } from "stream/consumers";
import LoginModal from "../../../pages/auth/loginModal";
import { stat } from "fs";
import { updateConversationCount } from "../../../state/countState";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ConversationProps {
  title: string;
  timestamp: string;
  conversationID: string;
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.authSlice.isAuth);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationProps[]
  >([]);

  const [hasFetchedYet, sethadFetchedYet] = useState(false);

  const isStreaming = useAppSelector(
    (state) => state.streamingSlice.isStreaming
  );

  const conID = useAppSelector(
    (state) => state.conversationSlice.conversationID
  );

  const fetchedMessages = useAppSelector(
    (state) => state.conversationSlice.fetchedMessages
  );

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchConversations = async () => {
  //     console.log("refering to bring")
  //     if (localStorage.getItem("userID")) {
  //       console.log("regeting convs");
  //       try {
  //         const conversationsHistory = await getConversations();
  //         setConversations(conversationsHistory);
  //       } catch (error) {
  //         console.error("Error fetching conversations:", error);
  //       }
  //     }
  //   };
  //   fetchConversations();
  //   sethadFetchedYet(true);
  // }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (localStorage.getItem("userID")) {
        // console.log("regeting convs");
        try {
          const conversationsHistory = await getConversations();
          setConversations(conversationsHistory);
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      }
    };
    fetchConversations();
    sethadFetchedYet(true);
  }, [authStatus, conID]);

  //fetches conversation
  // useEffect(() => {
  //   const fetchConversations = async () => {
  //     if (localStorage.getItem("userID")) {
  //       try {
  //         const conversationsHistory = await getConversations();
  //         setConversations(conversationsHistory);
  //         dispatch(updateConversationCount(conversationsHistory.length));
  //       } catch (error) {
  //         console.error("Error fetching conversations:", error);
  //       }
  //     }
  //   };

  //   if (!conversations.length) {
  //     fetchConversations();
  //     sethadFetchedYet(true);
  //   }
  // }, [conversations, authStatus , conID]);

  // filters conversation by search
  useEffect(() => {
    if (searchTerm.length > 1) {
      setFilteredConversations(
        conversations.filter((conversation) =>
          conversation.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredConversations(conversations);
    }
  }, [conversations, searchTerm]);

  //delets conversation
  function deleteConversationCall(conID: string) {
    console.log("trying to delete it in sidebar");
    setConversations((prevConversations) =>
      prevConversations.filter((c) => c.conversationID !== conID)
    );
    console.log("conID is: ", conID);
    console.log("local is: ", localStorage.getItem("conversationID"));

    if (localStorage.getItem("conversationID") === conID) {
      dispatch(newConversation());
      // localStorage.setItem("conversationID", "");
    }
  }
  const notifyStreamingWait = () => {
    toast.info("please wait until message will finish load", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "dark",
    });
  };
  // clear comversations when logout
  useEffect(() => {
    if (authStatus == false) {
      setConversations([]);
    }
  }, [authStatus]);

  function handlenewConversation() {
    if (isStreaming) {
      notifyStreamingWait();
      return;
    }
    dispatch(newConversation());
    localStorage.setItem("conversationID", "");
  }

  if (!authStatus) {
    return null;
  }
  return (
    <div className="sidebar-container">
      <div className="sb-head">
        <Tooltip
          arrow
          title="Unit 108 is a D level maintenance and development unit for electronics, softwere ICT and weapons in the israeli Air Froces  "
        >
          <a
            href="https://www.iaf.org.il/9325-52786-he/IAF.aspx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton>
              <img
                src={process.env.PUBLIC_URL + "/img/Bamza_108.png"}
                className="img108"
                alt="Bamza 108"
              />
            </IconButton>
          </a>
        </Tooltip>
        <div className="pro-name"> AI-r Assist</div>
      </div>
      <div className="sb-new" onClick={handlenewConversation}>
        <div>New Chat</div>
        <IconButton>
          <AddIcon></AddIcon>
        </IconButton>
      </div>
      {authStatus && conversations.length > 0 && (
        <div className="sb-search">
          <IconButton>
            <SearchIcon style={{ color: "white" }}></SearchIcon>
          </IconButton>
          <input
            placeholder="filter Chats"
            className="search-box"
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
        </div>
      )}
      {hasFetchedYet && filteredConversations.length === 0 && (
        <div className="no-conversations">
          <div style={{ color: "white", fontSize: "1.5rem" }}>No Chats yet</div>
          <img
            src={process.env.PUBLIC_URL + "/img/empty.png"}
            // className="userIcon"
            className="noChatIcon"
            alt="Bamza 108"
          />
        </div>
      )}
      {filteredConversations.length > 0 && (
        <div className="sb-conversations" style={{ overflowY: "auto" }}>
          <div
            className="contain"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="sb-conversations" className="chat-headline">
              Chat History
            </label>
            <div
              style={{ borderBottom: "1px solid white", width: "100%" }}
            ></div>
          </div>

          {filteredConversations.map((conversation) => {
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
      )}

      <div
        className="userIndicator"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          border: "1px solid rgb(28, 30, 58, 1)",
          borderRadius: "1rem",
          margin: "0 1rem",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
        onClick={() => navigate("/User")}
      >
        <IconButton>
          <PersonIcon style={{ color: "white", fontSize: "2rem" }}></PersonIcon>
        </IconButton>
        <div
          style={{ color: "white", fontFamily: "Arial", fontSize: "1.4rem" }}
        >
          {localStorage.getItem("userName") || "Guest"}
        </div>
      </div>
    </div>
  );
}
