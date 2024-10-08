import React, { useState, useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import atelierCaveDark from "react-syntax-highlighter/dist/esm/styles/hljs/atelier-cave-dark";

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
import { Javascript } from "@mui/icons-material";
import { dark } from "@mui/material/styles/createPalette";
import { turnStreamOff, turnStreamOn } from "../../../state/streamingStatus";
import LoadingIcons from "react-loading-icons";

interface MessageProps {
  sender: string;
  value: string;
  messageIndex: number;
  messageID?: string;
  onlyLoader?: boolean;
  lastMessageID?: string;
}

const DisplayMessage: React.FC<MessageProps> = ({
  sender,
  value,
  messageID,
  onlyLoader = false,
  messageIndex,
}) => {
  const messageState = useAppSelector(
    (state) => state.currentMessageSlice.messageID
  );

  const [accumulatedContent, setAccumulatedContent] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null); // Typing socket state
  const [loading, setIsLoading] = useState(false);
  const [streaming, setSteraming] = useState(false);

  const dispatch = useAppDispatch();

  const [currentChunk, setCurrentChunk] = useState<string>("");

  const [generatingCode, setIsGeneratingCode] = useState(false);

  const [regenrateFlag, setregenerateFlag] = useState(false);

  const conID = useAppSelector(
    (state) => state.conversationSlice.conversationID
  );

  const modelStatus = useAppSelector((state) => state.modelSlice.model);

  const [inCodeBlock, setIsOnCodeBlock] = useState(false);

  const [isCopied, setCopied] = useState(false);

  // useEffect(() => {
  //   if (
  //     sender === "LLama" &&
  //     // messageIndex != 0 &&
  //     messageState === messageID &&
  //     value === "you fail" &&
  //     onlyLoader === false
  //   ) {
  //     if (!socket) {
  //       getMsg();
  //     }
  //   } else {
  //     if (socket) {
  //       socket.disconnect();
  //       setSocket(null);
  //     }
  //   }
  //   return () => {
  //     setAccumulatedContent("");
  //   };
  // }, []);

  // function getMsg() {
  //   console.log("i am in the msg");
  //   const newSocket = io("http://localhost:8080", {
  //     transports: ["websocket"],
  //   });

  //   newSocket.on("connect", () => {
  //     console.log("Connected to socket server is: ", sender, messageID);
  //     setIsLoading(true);
  //     dispatch(turnStreamOn());
  //   });

  //   newSocket.on("error", (error) => {
  //     console.error("Error:", error.message);
  //   });

  //   newSocket.on("generatingCode", () => {
  //     setIsGeneratingCode((prevState) => !prevState);
  //   });

  //   newSocket.on("generated_text", (textChunk): void => {
  //     setIsLoading(false);
  //     if (!streaming) {
  //       setSteraming(true);
  //     }

  //     setAccumulatedContent((prevContent) => prevContent + textChunk);
  //     setCurrentChunk(textChunk);
  //     // setValueState((prevContent) => prevContent + textChunk)
  //   });

  //   newSocket.on("stream_end", () => {
  //     dispatch(turnStreamOff());
  //     console.log("ending");
  //     if (regenrateFlag) {
  //     }
  //     setSteraming(false);
  //     setregenerateFlag(false);
  //     newSocket.disconnect(); // Disconnect the newSocket instance
  //     setIsGeneratingCode(false);
  //   });

  //   setSocket(newSocket);
  // }

  useEffect(() => {
    console.log("meesage idx is: ", messageIndex, "message value is: ", value);
  }, []);

  const isUserSender = sender != "LLama";

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

  async function handleRestartClick() {
    setIsLoading(true);
    const regenRes = await regenerateResponse(messageIndex, modelStatus);
    if (!regenRes.aiResponse) {
      setAccumulatedContent("");
      setregenerateFlag(true);
    } else {
      setAccumulatedContent(regenRes.aiResponse);
    }
    setIsLoading(false);
  }

  if (onlyLoader) {
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
        <div className="bot-content">
          <LoadingSpinner></LoadingSpinner>
        </div>
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
        {accumulatedContent && streaming && (
          <RenderFetchedContent
            content={accumulatedContent}
            genertaingCode={generatingCode}
          ></RenderFetchedContent>
        )}
        {accumulatedContent && !streaming && (
          <RenderFetchedContent
            content={accumulatedContent}
            genertaingCode={generatingCode}
          />
        )}

        {!regenrateFlag && !accumulatedContent && value != "you fail" && (
          <RenderFetchedContent
            content={value}
            genertaingCode={generatingCode}
          ></RenderFetchedContent>
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
          </div>
        </div>
      )}
    </div>
  );
};

const RenderFetchedContent: React.FC<{
  content: string;
  genertaingCode: boolean;
}> = ({ content, genertaingCode }) => {
  content = content.replace(/\*/g, "");

  // content = content.replace(/\n\s*\n/g, "\n");

  content = content.trimStart();

  const codeBlockRegex = /```([\s\S]+?)```/g;

  // Split content into parts: code blocks and regular text
  const parts = content.split(codeBlockRegex);

  // Render code blocks and regular text
  const renderParts = () => {
    let lastPartIndex = -1;

    const renderedParts = parts.map((part, index) => {
      if (index % 2 === 0) {
        lastPartIndex = index;
        // Regular text
        return (
          <div
            style={{ whiteSpace: "pre-wrap", fontSize: "meduim" }}
            key={index}
          >
            {part}
          </div>
        );
      } else {
        // Code block
        const lang = part.split("\n")[0].trim(); 
        const lines = part.split("\n");
        const code = lines
          .slice(1)
          .join("\n")
          .replace(/^\s*[\r\n]/g, "");
        // const code = part.replace(/^\s*[\r\n]/g, ""); // Remove leading newline
        return (
          <SyntaxHighlighter
            key={index}
            language={lang || "plaintext"}
            style={a11yDark}
            customStyle={{
              backgroundColor: "#263238",
              padding: "0.5rem",
              borderRadius: "1rem",
              margin: "0.2rem 0rem",
              lineHeight: "1.6rem",
            }}
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
        );
      }
    });
    if (lastPartIndex !== -1 && genertaingCode) {
      renderedParts.splice(
        lastPartIndex + 1,
        0,
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0096FF",
          }}
        >
          <div>Generating Code</div>
          <LoadingIcons.BallTriangle
            key="loading-icon"
            style={{
              fontSize: "2rem",
              color: "blue",
              height: "2.5rem",
              stroke: "black",
            }}
          />
        </div>
      );
    }
    return renderedParts;
  };

  return <>{renderParts()}</>;
};

const RenderContent: React.FC<{
  content: string;
  setIsOnCodeBlock: (is: boolean) => void;
  inCodeBlock: boolean;
}> = ({ content, setIsOnCodeBlock, inCodeBlock }) => {
  const formattedText = content.replace(/\n/g, "<br/>");
  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

export default DisplayMessage;
