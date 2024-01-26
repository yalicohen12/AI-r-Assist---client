// ChatArea component
import React, { useState, useEffect, ReactElement, useRef } from "react";
import "./chatArea.css";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DisplayMessage from "../message/message";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Nightlight } from "@mui/icons-material";
import { handleNewQuestion } from "../../services/apis/conversationsAPI";
import { getConversation } from "../../services/apis/conversationsAPI";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/auth/loginModal";
import { useAppDispatch, useAppSelector } from "../../state";
import { disConnect } from "../../state/authStatusState";
import ColorToggle from "./colorMode/colorToggle";
import SaveChatModal from "./saveChatModal/saveChatModal";
import SaveIcon from "@mui/icons-material/Save";

export default function ChatArea() {
  const authStatus = useAppSelector((state) => state.authSlice.isAuth);

  const conID = useAppSelector(
    (state) => state.conversationSlice.conversationID
  );

  const fetchaedMsgs = useAppSelector(
    (state) => state.conversationSlice.fetchedMessages
  );
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ReactElement[]>([]);
  const [isApiProcessing, setIsApiProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveChatOpen, setIsSaveChatOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!authStatus) {
      setIsOpen(true);
    }
  }, []);
  async function fetchConversationMessages() {
    try {
      const response = await getConversation();
      const newMessages = response.map((msg: any, index: number) => (
        <DisplayMessage key={index} sender={msg.sender} value={msg.value} />
      ));
      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
    }
  }
  useEffect(() => {
    if (messages.length != 0) {
      handleScrollDown();
    }
  }, [messages]);

  useEffect(() => {
    // console.log(conID);
    if (conID) {
      fetchConversationMessages();
    }
    if (fetchaedMsgs == true || conID == "") {
      setMessages([]);
    }
  }, [conID, fetchaedMsgs]);

  async function handleSendMessage() {
    if (!localStorage.getItem("userID")) {
      setIsOpen(true);
      return;
    }
    if (message == "" || message.length < 2) {
      return;
    }
    const messageVaribale = message;
    setMessage("");
    const msg = <DisplayMessage sender="You" value={messageVaribale} />;
    setIsApiProcessing(true);

    setMessages((prevMessages) => [...prevMessages, msg]);
    try {
      const response = await handleNewQuestion(messageVaribale);
      setMessage("");

      const apiResponseMessage = (
        <DisplayMessage sender="LLama" value={response || "" || "not"} />
      );
      setMessages((prevMessages) => [...prevMessages, apiResponseMessage]);
    } catch (err) {
      console.error(err);
      <DisplayMessage sender="LLama" value={"i am currently down"} />;
    } finally {
      setIsApiProcessing(false);
    }

    setMessage("");
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  function handleScrollDown(): void {
    const messagesDiv = document.getElementById("messages");
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }

  function handleLogout(): void {
    dispatch(disConnect());
    localStorage.clear();
  }

  useEffect(() => {
    if (conID) {
      fetchConversationMessages();
    }
  }, []);
  useEffect(() => {
    if (!authStatus) {
      setMessages([]);
    }
  }, [authStatus]);

  return (
    <div className="chatArea-container">
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)}></LoginModal>
      <SaveChatModal
        isOpen={isSaveChatOpen}
        onClose={() => setIsSaveChatOpen(false)}
      ></SaveChatModal>
      <div className="chatArea-header">
        {messages.length > 0 && (
          <div className="saveChatArea" onClick={() => setIsSaveChatOpen(true)}>
            <SaveIcon style={{ fontSize: "2rem" }}></SaveIcon>
            <button className="saveChat">Save Chat</button>
          </div>
        )}
        <div className="active-tab">Chat</div>
        <div className="tab">Files</div>
        <div className="tab">User</div>
        <div className="chat-icons">
          <div className="mode-icon">
            <IconButton>
              <div className="colorContainer">
                <ColorToggle></ColorToggle>
              </div>
            </IconButton>
          </div>
          <div className="logindicator">
            <IconButton className="icon">
              {authStatus && (
                <div className="logContainer">
                  <div className="logTxt"> Logout</div>
                  <LogoutIcon
                    onClick={handleLogout}
                    className="logouticon"
                    color="primary"
                  ></LogoutIcon>
                </div>
              )}
              {!authStatus && (
                <div className="logContainer">
                  <div className="logTxt">Login</div>
                  <LoginIcon
                    onClick={() => setIsOpen(true)}
                    className="logouticon"
                    color="primary"
                  ></LoginIcon>
                </div>
              )}
            </IconButton>
          </div>
        </div>
      </div>
      {messages.length > 0 && <div className="line"></div>}
      <div id="messages" className="msgs">
        {(isOpen==false && (!messages || messages.length === 0)) && (
          <div className="wel-p">How can I help you?</div>
        )}
        {!messages || messages.length === 0 ? null : <>{messages}</>}
      </div>
      <div className="btns">
        <div className="input-container">
          <label htmlFor="fileInput" className="uploadBTN">
            <div style={{ display: "flex", alignItems: "center" }}>
              <UploadFileIcon
                className="upload"
                style={{ fontSize: "26px", color: "white", marginRight: "8px" }}
              ></UploadFileIcon>
              <div className="dploaddiv"> Upload File</div>
            </div>
            <input
              type="file"
              id="fileInput"
              accept=".pdf, .doc, .docx"
              style={{ display: "none" }}
              // onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="text-input-area">
          <textarea
            placeholder="Type message"
            className="search-box"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isApiProcessing}
          />
          <IconButton
            disabled={isApiProcessing}
            onClick={() => handleSendMessage()}
          >
            <SendIcon style={{ color: "white" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
