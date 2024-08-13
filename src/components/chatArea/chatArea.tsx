// ChatArea component
import React, { useState, useEffect, ReactElement, useRef } from "react";
import "./chatArea.css";
import { IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DisplayMessage from "../chatPageComponents/message/message";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Nightlight } from "@mui/icons-material";
import { handleNewQuestion } from "../../services/apis/conversationsAPI";
import { getConversation } from "../../services/apis/conversationsAPI";
import { deleteMsg } from "../../services/apis/conversationsAPI";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/auth/loginModal";
import { useAppDispatch, useAppSelector } from "../../state";
import { disConnect } from "../../state/authStatusState";
import { onFirstMsg } from "../../state/conversationState";
import ColorToggle from "../chatPageComponents/colorMode/colorToggle";
import SaveChatModal from "../chatPageComponents/saveChatModal/saveChatModal";
import SaveIcon from "@mui/icons-material/Save";
import TabsNav from "../tabsNavigation/tabs";
import LoadingSpinner from "../chatPageComponents/loader/loadingSpinner";
import { newConversation, set } from "../../state/conversationState";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { setMessageID } from "../../state/currentMessageState";
import CodeIcon from "@mui/icons-material/Code";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import InsightsIcon from "@mui/icons-material/Insights";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import { render } from "@testing-library/react";
import ModelDropdown from "../chatPageComponents/modelDropdown/modelDropdown";
import LinearProgress from "@mui/material/LinearProgress";
import { deleteConversation } from "../../services/apis/conversationsAPI";
import { JSX } from "react/jsx-runtime";
import { Socket, io } from "socket.io-client";
import { clearFile, setFile } from "../../state/fileState";
import { setPage } from "../../state/pageState";
import { turnStreamOff, turnStreamOn } from "../../state/streamingStatus";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  FileCard,
  ExtFile,
  FilesUiProvider,
  FileMosaic,
} from "@files-ui/react";
import { jsx } from "@emotion/react";


export default function ChatArea() {
  const authStatus = useAppSelector((state) => state.authSlice.isAuth);

  const conID = useAppSelector(
    (state) => state.conversationSlice.conversationID
  );

  const modelStatus = useAppSelector((state) => state.modelSlice.model);

  const fetchaedMsgs = useAppSelector(
    (state) => state.conversationSlice.fetchedMessages
  );

  const streamingStatus = useAppSelector(
    (state) => state.streamingSlice.isStreaming
  );

  const [rows, setRows] = useState(1);

  const importedFileName = useAppSelector((state) => state.fileSlice.fileName);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ReactElement[]>([]);

  const [isApiProcessing, setIsApiProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveChatOpen, setIsSaveChatOpen] = useState(false);

  const [isChecked, setIsChecked] = useState(true);

  const currentConversationName = useAppSelector(
    (state) => state.conversationSlice.conversationName
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const [currentFileChat, setCurrentFile] = useState("");
  // console.log(currentFileChat);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (value: string) => {
    setSelectedCard(value === selectedCard ? null : value);
  };

  const dispatch = useAppDispatch();

  function handleLogout(): void {
    dispatch(disConnect());
    dispatch(newConversation());
    localStorage.clear();
  }
  

  useEffect(() => {
    dispatch(setPage("Chat"));
  }, []);

  const notifyFileOverflow = () => {
    toast.error("File is to long", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  function handleFileRemove() {
    setCurrentFile("");
    setUploadedFile(null);
    if (importedFileName) {
      dispatch(clearFile());
    }
  }

  function generateMessageID(): string {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2);
    return timestamp + randomString;
  }

  //handles new file picked
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        if (event.target) {
          // Check if event.target is not null
          const text = event.target.result as string;
          const wordCount = text.split(/\s+/).length;

          if (wordCount <= 1200) {
            console.log(wordCount);
            setUploadedFile(file);
            setCurrentFile(file.name);
          } else {
            console.error("File text exceeds 1200 words.");
            notifyFileOverflow();
          }
        } else {
          console.error("Event target is null.");
        }
        // resizeTextArea();
      };

      reader.onerror = () => {
        console.error("Error reading file.");
        // Optionally, you can also show an error message to the user
      };

      reader.readAsText(file); // Read the file data as text
    }
    // addOneRow();
  };

  const [textareaHeight, setTextareaHeight] = useState("0.2rem");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // const [spinnerPosition, setSpinnerPosition] = useState<string>("13%");
  // const messagesRef = useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   console.log("mile 1");
  //   if (messagesRef.current) {
  //     const containerHeight = messagesRef.current.clientHeight;
  //     console.log("mile 2: ", containerHeight);
  //     setSpinnerPosition(`${containerHeight + 5}px`);
  //   }
  // }, [messages]);

  const resizeTextArea = () => {
    // console.log("resizeng");
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        Math.min(170, textAreaRef.current.scrollHeight) + "px";
    }
  };

  useEffect(resizeTextArea, [message, currentFileChat, importedFileName]);

  // gets the conversation
  async function fetchConversationMessages() {
    try {
      // console.log("here");
      const response = await getConversation();
      let currFile = response.fileName || "";
      // console.log(response);
      setCurrentFile(currFile);
      const newMessages = response.messages.map((msg: any, index: number) => (
        <DisplayMessage
          key={index}
          sender={msg.sender}
          value={msg.value}
          messageIndex={index}
        />
      ));
      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
    }
  }
  // handles scroll down when new message
  useEffect(() => {
    if (messages.length != 0) {
      handleScrollDown();
    }
  }, [messages]);

  //calls fetch messages when user load conversation
  useEffect(() => {
    // console.log(conID);
    // console.log("mile1")
    if (conID && fetchaedMsgs == false) {
      // console.log("mile2")
      fetchConversationMessages();
    }
    if (conID == "") {
      setUploadedFile(null);
      setMessages([]);
      setCurrentFile("");
    }
  }, [conID, fetchaedMsgs]);

  const notifyLogin = () => {
    toast.info("you must be logged in to chat with the model", {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 3000,
    });
  };

  // handles user send message
  async function handleSendMessage() {
    dispatch(turnStreamOn());
    if (!localStorage.getItem("userID")) {
      setIsOpen(true);
      notifyLogin();
      return;
    }
    // setIsLoading(true);

    if (message == "" || message.length < 2) {
      return;
    }
    const messageVaribale = message;
    setMessage("");

    const msg = (
      <DisplayMessage sender={localStorage.getItem("userName")|| "You"} value={messageVaribale} messageIndex={messages.length} />
    );
    if (modelStatus !== "online") {
      setIsApiProcessing(true);
    }

    setMessages((prevMessages) => [...prevMessages, msg]);

    if (modelStatus === "online") {
      setIsLoading(true);
    }
    setIsLoading(true);
    console.log(modelStatus);

    try {
      let isItNew = false;
      if (
        !localStorage.getItem("conversationID") ||
        localStorage.getItem("conversationID") == ""
      ) {
        isItNew = true;
      }

      console.log(isItNew);

      const msgID = generateMessageID();
      dispatch(setMessageID(msgID));
      handleScrollDown();

      // let initalMSG: JSX.Element;
      const initalMSG: JSX.Element = (
        <DisplayMessage
          sender="LLama"
          onlyLoader = {true}
          value=""
          messageIndex= {199}
        />
      );
      setMessages((prevMessages) => [...prevMessages , initalMSG]);


      const response = await handleNewQuestion(
        messageVaribale,
        selectedCard || "",
        (isChecked && uploadedFile) || null,
        (isChecked && currentFileChat) || (isChecked && importedFileName) || "",
        modelStatus
      );
      console.log(response);

      let apiResponseMessage: JSX.Element;
      if (response.aiResponse) {
        apiResponseMessage = (
          <DisplayMessage
            sender="LLama"
            value={response.aiResponse}
            messageIndex={messages.length}
          />
        );
        dispatch(turnStreamOff());
      } else {
        apiResponseMessage = (
          <DisplayMessage
            sender="LLama"
            value={"you fail" || "" || "not"}
            messageIndex={messages.length}
            messageID={msgID}
          />
        );
      }
      if (isItNew) {
        console.log("first MSG detcet");
        // dispatch(set(localStorage.getItem("conversationID") + ""));
        dispatch(onFirstMsg(localStorage.getItem("conversationID") + ""));
      }
      setMessage("");

      setMessages((prevMessages) => prevMessages.slice(0, -1));
      
      setMessages((prevMessages) => [...prevMessages, apiResponseMessage]);
    
    } catch (err) {
      console.error(err);
      <DisplayMessage
        sender="LLama"
        value={"i am currently down"}
        messageIndex={0}
      />;
    } finally {
      setIsLoading(false);
      setIsApiProcessing(false);
    }

    setMessage("");
    if (isChecked && uploadedFile) {
      setUploadedFile(null);
    }
    handleScrollDown();
  }

  const deleteMessage = (messageID: number) => {
    try {
      deleteMsg(messageID, conID);
      setMessages((prevMessages) =>
        prevMessages.filter(
          (msg) =>
            msg.props.messageID !== messageID &&
            msg.props.messageID !== messageID - 1
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  function handleScrollDown(): void {
    // const messagesDiv = document.getElementById("messages");
    // if (messagesDiv) {
    //   messagesDiv.scrollTop = messagesDiv.scrollHeight;
    // }
    if (modelStatus != "online") {
      const chatArea = document.querySelector(".msgs");
      if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
      }
    }
    // console.log("in");
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
        conversationName={currentConversationName || ""}
      ></SaveChatModal>
      <div
        className="chat-header"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div style={{ float: "left", marginTop: "1%", marginLeft: "0.5rem" }}>
          <ModelDropdown />
        </div>
        {authStatus && (
          <div style={{ margin: "0 auto" }}>
            <TabsNav />
          </div>
        )}
        <div style={{ marginLeft: "auto" }}></div>{" "}
        <div className="chat-icons">
          <div className="mode-icon">
            <IconButton>
              <div className="colorContainer">
                {/* <ColorToggle></ColorToggle> */}
              </div>
            </IconButton>
          </div>
          <div className="logindicator">
            <IconButton
              className="icon"
              onClick={authStatus ? handleLogout : () => setIsOpen(true)}
            >
              {authStatus && (
                <div className="logContainer">
                  <LogoutIcon className="logouticon"></LogoutIcon>
                  <div className="logTxt"> Logout</div>
                </div>
              )}
              {!authStatus && (
                <div className="logContainer">
                  <div className="logTxt">Login</div>
                  <LoginIcon
                    // onClick={() => setIsOpen(true)}
                    className="logouticon"
                    color="primary"
                  ></LoginIcon>
                </div>
              )}
            </IconButton>
          </div>
        </div>
      </div>

      <div id="messages" className="msgs">
        {isOpen == false && (!messages || messages.length === 0) && (
          <div className="wel-p"> How can I help you today?</div>
        )}
        {/* <div className="circle"></div> */}
        {!messages || messages.length === 0 ? null : <>{messages}</>}
        {/* {isLoading && (
          <div
            style={{
              position: "absolute",
              left: "31%",
              bottom: "0%",
              backgroundColor: "rgb(28, 30, 58, 1)",
              padding: "0.4rem",
              borderRadius: "1rem",
            }}
          >
            <LoadingSpinner></LoadingSpinner>
          </div>
        )} */}
      </div>
      {message && (
        <div className="anot-container">
          <div className="anot-cards">
            <div className="anote-head"> Anotate :</div>
            <div
              className={`anot-code-card ${
                selectedCard === "code" ? "selected" : ""
              }`}
              onClick={() => handleCardClick("code")}
            >
              <CodeIcon />
              <div>Coding task</div>
            </div>
            <div
              className={`anot-code-card ${
                selectedCard === "QA" ? "selected" : ""
              }`}
              onClick={() => handleCardClick("QA")}
            >
              <QuestionAnswerIcon />
              <div>Q&A</div>
            </div>
            <div
              className={`anot-code-card ${
                selectedCard === "insights" ? "selected" : ""
              }`}
              onClick={() => handleCardClick("insights")}
            >
              <InsightsIcon />
              <div>Insights generation</div>
            </div>
          </div>
        </div>
      )}
      <div className="btns">
        {/* {authStatus && currentFileChat && (
          <div className="saveChatArea">
            <div className="fileName"> {currentFileChat}</div>
            <Tooltip title={isChecked ? "Cancel File usage" : "Use File"} arrow>
              <Checkbox
                checked={isChecked}
                onChange={handleCheckboxChange}
                color="success"
              />
            </Tooltip>
            <IconButton onClick={handleFileRemove}>
              <CloseIcon
                style={{
                  marginBottom: "auto",
                  color: "black",
                  fontSize: "1.5rem",
                }}
              ></CloseIcon>
            </IconButton>
          </div>
        )}
        {authStatus && !currentFileChat && importedFileName && (
          <div className="saveChatArea">
            <div className="fileName"> {importedFileName}</div>
            <Tooltip title={isChecked ? "Cancel File usage" : "Use File"} arrow>
              <Checkbox
                checked={isChecked}
                onChange={handleCheckboxChange}
                color="success"
              />
            </Tooltip>
            <IconButton onClick={handleFileRemove}>
              <CloseIcon
                style={{
                  marginBottom: "auto",
                  color: "black",
                  fontSize: "1.5rem",
                }}
              ></CloseIcon>
            </IconButton>
          </div>
        )} */}
        <div className="chat-tail">
          <div className="text-input-area">
            <textarea
              placeholder="Type a message"
              className="search-box"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={textAreaRef}
              onKeyDown={handleKeyPress}
              // disabled={streamingStatus}
              rows={1}
              style={{ resize: "none" }} // Apply dynamic height
            />
            {authStatus && currentFileChat && (
              <div style={{ marginBottom: "1.2rem" }}>
                <FilesUiProvider config={{ darkMode: true }}>
                  <FileMosaic
                    name={currentFileChat}
                    type="text/plain"
                    onDelete={handleFileRemove}
                    style={{ height: "2.8rem", width: "5rem" }}
                  ></FileMosaic>
                </FilesUiProvider>
              </div>
            )}

            {authStatus && !currentFileChat && importedFileName && (
              <FilesUiProvider config={{ darkMode: true }}>
                <FileMosaic
                  name={importedFileName}
                  type="text/plain"
                  onDelete={handleFileRemove}
                  style={{ height: "2.8rem", width: "3rem" }}
                ></FileMosaic>
              </FilesUiProvider>
            )}

            <Tooltip title="send" arrow placement="top">
              <IconButton
                disabled={streamingStatus}
                onClick={() => handleSendMessage()}
              >
                <SendIcon style={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </div>

          <label htmlFor="fileInput" className="">
            <div
              className="lab"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tooltip
                title={
                  uploadedFile || currentFileChat
                    ? "Change File"
                    : "Attach File"
                }
                arrow
              >
                {/* <img
                  src={process.env.PUBLIC_URL + "/img/file.png"}
                  style={{ height: "2.2rem" }}
                ></img> */}
                <AttachFileIcon
                  style={{ height: "2rem", width: "2rem", color: "white" }}
                ></AttachFileIcon>
              </Tooltip>
              <input
                type="file"
                id="fileInput"
                accept=".txt, .doc, .docx, .py, .js"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </label>

          {messages.length > 1 && (
            <Tooltip title="Save Chat" arrow>
              <IconButton
                onClick={() => setIsSaveChatOpen(true)}
                sx={{
                  height: "3.5rem",
                  width: "3.5rem",
                  backgroundColor: "#1F012E",
                  "&:hover": {
                    backgroundColor: "#250635",
                  },
                }}
                className="saveChat-icon"
              >
                <SaveIcon fontSize="large" color="primary"></SaveIcon>
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
