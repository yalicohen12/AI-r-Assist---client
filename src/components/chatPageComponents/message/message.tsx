import React, { useState, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  a11yLight,
  a11yDark,
  darcula,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./message.css";
import { IconButton, Tooltip } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { io, Socket } from "socket.io-client"; // Import Socket type from socket.io-client
import { useAppDispatch, useAppSelector } from "../../../state";
import LoadingSpinner from "../loader/loadingSpinner";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { regenerateResponse } from "../../../services/apis/conversationsAPI";

interface MessageProps {
  sender: string;
  value: string;
  messageID: number;
  onlyLoader?: boolean;
}

const DisplayMessage: React.FC<MessageProps> = ({
  sender,
  value,
  messageID,
  onlyLoader = false,
}) => {
  const messageState = useAppSelector(
    (state) => state.currentMessageSlice.messageID
  );
  const [accumulatedContent, setAccumulatedContent] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null); // Typing socket state
  const [loading, setIsLoading] = useState(false);
  const [streaming, setSteraming] = useState(false);

  const [regenrateFlag, setregenerateFlag] = useState(false);

  const [valueState, setValueState] = useState<string>(value);

  const conID = useAppSelector(
    (state) => state.conversationSlice.conversationID
  );

  const modelStatus = useAppSelector((state) => state.modelSlice.model);

  // useEffect(() => {
  //   setAccumulatedContent("");
  // }, [conID]);

  // useEffect(() => {
  //   if (value != "you fail") {
  //     setAccumulatedContent(value);
  //   }
  // }, []);

  // const [valueState, setValueState] = useState("");

  // useEffect(() => {
  //   setValueState(value);
  // }, [value]);

  const [inCodeBlock, setIsOnCodeBlock] = useState(false);

  useEffect(() => {
    setAccumulatedContent("");
  }, []);

  const [isCopied, setCopied] = useState(false);

  useEffect(() => {
    if (
      sender === "LLama" &&
      messageID != 0 &&
      messageState === messageID &&
      value === "you fail" &&
      onlyLoader === false
    ) {
      if (!socket) {
        getMsg();
      }
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, []);

  function getMsg() {
    console.log("i am in the msg");
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server is: ", sender, messageID);
      setIsLoading(true);
    });

    newSocket.on("error", (error) => {
      console.error("Error:", error.message);
    });

    newSocket.on("generated_text", (textChunk) => {
      setIsLoading(false);
      if (!streaming) {
        setSteraming(true);
      }
      setAccumulatedContent((prevContent) => prevContent + textChunk);
      // setValueState((prevContent) => prevContent + textChunk)
    });

    newSocket.on("stream_end", () => {
      console.log("ending");
      if (regenrateFlag) {
        setValueState(accumulatedContent);
      }
      setSteraming(false);
      setregenerateFlag(false);
      newSocket.disconnect(); // Disconnect the newSocket instance
    });

    setSocket(newSocket);
  }

  const isUserSender = sender === "You";

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000); // 3000 milliseconds = 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // console.log("Text copied to clipboard:", text);
      })
      .catch((error) => {
        console.error("Unable to copy text to clipboard:", error);
      });
    setCopied(true);
  };

  function DeleteMessage() {}

  async function handleRestartClick() {
    setIsLoading(true)
    const regenRes = await regenerateResponse(messageID, modelStatus);
    if (!regenRes.aiResponse) {
      setAccumulatedContent("");
      // setValueState("");
      setregenerateFlag(true);
      getMsg();
    } else {
      setAccumulatedContent(regenRes.aiResponse);
    }
    setIsLoading(false)
  }

  if (onlyLoader) {
    return (
      <div className="message-container">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  return (
    <div className="message-container">
      <div className="msg-head">
        <IconButton>
          {isUserSender ? (
            <AccountCircleIcon
              style={{ fontSize: "2rem" }}
              className="userIcon"
              color="primary"
            />
          ) : (
            <IconButton>
              <img
                src={process.env.PUBLIC_URL + "/img/llama.png"}
                className="userIcon"
                alt="Bamza 108"
              />
            </IconButton>
          )}
        </IconButton>
        <div className="msg-sender">{sender}</div>
      </div>
      <div className={isUserSender ? "message-content" : "bot-content"}>
        {accumulatedContent && (
          <RenderContent
            content={accumulatedContent}
            inCodeBlock={inCodeBlock}
            setIsOnCodeBlock={setIsOnCodeBlock}
          />
        )}
        {!regenrateFlag && !accumulatedContent && value != "you fail" && (
          <RenderContent
            content={value}
            inCodeBlock={inCodeBlock}
            setIsOnCodeBlock={setIsOnCodeBlock}
          />
        )}
        {loading && <LoadingSpinner></LoadingSpinner>}
      </div>
      {!loading && !streaming && sender === "LLama" && (
        <div className="messageIcons">
          <div
            className="msgIcon"
            style={{
              borderRadius: "1rem",
            }}
          >
            <Tooltip title={isCopied ? "Copied" : "Copy"} arrow>
              <IconButton
                onClick={() => copyToClipboard(accumulatedContent || value)}
              >
                {isCopied && (
                  <CheckIcon
                    color="primary"
                    style={{ fontSize: "1.4rem" }}
                  ></CheckIcon>
                )}
                {!isCopied && (
                  <ContentCopyIcon
                    color="primary"
                    style={{ fontSize: "1.4rem" }}
                  ></ContentCopyIcon>
                )}
              </IconButton>
            </Tooltip>
          </div>
          <div
            className="msgIcon"
            style={{
              borderRadius: "1rem",
            }}
          >
            <Tooltip title="Regenrate response" arrow>
              <IconButton onClick={handleRestartClick}>
                <RestartAltIcon
                  color="primary"
                  style={{ fontSize: "1.4rem", color: "green" }}
                ></RestartAltIcon>
              </IconButton>
            </Tooltip>
          </div>
          <div
            className="msgIcon"
            style={{
              borderRadius: "1rem",
            }}
          >
            {/* {messageID>1 &&<Tooltip title="Delete" arrow>
              <IconButton onClick={handleDelete}>
                <DeleteIcon
                  style={{ color: "red", fontSize: "1.4rem" }}
                ></DeleteIcon>
              </IconButton>
            </Tooltip>} */}
          </div>
        </div>
      )}
    </div>
  );
};

const RenderContent: React.FC<{
  content: string;
  inCodeBlock: boolean;
  setIsOnCodeBlock: (is: boolean) => void;
}> = ({ content, inCodeBlock, setIsOnCodeBlock }) => {
  if (inCodeBlock) {
    if (content.includes("```")) {
      setIsOnCodeBlock(false);
    }
    return (
      <div>{content}</div>
      // <SyntaxHighlighter
      //   customStyle={{
      //     // backgroundColor: "#282A3A",
      //     padding: "0.1rem",
      //     borderRadius: "20px",
      //   }}
      //   language={"python"}
      //   style={darcula}
      // >
      //   {content}
      // </SyntaxHighlighter>
    );
  } else if (!inCodeBlock && content.includes("```")) {
    setIsOnCodeBlock(true);
    return (
      // <SyntaxHighlighter
      //   customStyle={{
      //     backgroundColor: "#282A3A",
      //     padding: "0.5rem",
      //     borderRadius: "20px",
      //   }}
      //   language={"python"}
      //   style={darcula}
      // >
      //   {content}
      // </SyntaxHighlighter>
      <div>{content}</div>
    );
  } else {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: content.replace(/\n/g, "<br />"),
        }}
      />
    );
  }
};

export default DisplayMessage;
