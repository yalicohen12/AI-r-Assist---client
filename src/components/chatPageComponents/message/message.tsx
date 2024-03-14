import React, { useState, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  a11yLight,
  a11yDark,
  darcula,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./message.css";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { io, Socket } from "socket.io-client"; // Import Socket type from socket.io-client
import { useAppDispatch, useAppSelector } from "../../../state";
import LoadingSpinner from "../loader/loadingSpinner";

interface MessageProps {
  sender: string;
  value: string;
  messageID: number;
}

const DisplayMessage: React.FC<MessageProps> = ({
  sender,
  value,
  messageID,
}) => {
  const messageState = useAppSelector(
    (state) => state.currentMessageSlice.messageID
  );
  const [accumulatedContent, setAccumulatedContent] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null); // Typing socket state
  const [loading, setIsLoading] = useState(false);

  const [inCodeBlock, setIsOnCodeBlock] = useState(false);

  useEffect(() => {
    if (sender === "LLama" && messageID != 0 && messageState === messageID) {
      if (!socket) {
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
          setAccumulatedContent((prevContent) => prevContent + textChunk);
        });

        newSocket.on("stream_end", () => {
          console.log("ending");
          newSocket.disconnect(); // Disconnect the newSocket instance
        });

        setSocket(newSocket);
      }
    } else {
      if (socket) {
        socket.disconnect();
      }
    }
  }, []);

  const isUserSender = sender === "You";

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
        {accumulatedContent ? (
          <RenderContent
            content={accumulatedContent}
            inCodeBlock={inCodeBlock}
            setIsOnCodeBlock={setIsOnCodeBlock}
          />
        ) : // <div>{accumulatedContent}</div>
        null}
        {value != "you fail" && <RenderContent
            content={value}
            inCodeBlock={inCodeBlock}
            setIsOnCodeBlock={setIsOnCodeBlock}
          />}
        {loading && <LoadingSpinner></LoadingSpinner>}
      </div>
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
