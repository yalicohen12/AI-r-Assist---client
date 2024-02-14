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

  useEffect(() => {
    console.log("render mesg");
    if (sender === "LLama" && messageID != 0 && messageState === messageID) {
      if (!socket) {
        const newSocket = io("http://localhost:8080", {
          transports: ["websocket"],
        });

        newSocket.on("connect", () => {
          console.log("Connected to socket server is: ", sender, messageID);
        });

        newSocket.on("error", (error) => {
          console.error("Error:", error.message);
        });

        newSocket.on("generated_text", (textChunk) => {
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
          <RenderContent content={accumulatedContent} />
        ) : null}
        {value != "you fail" && value}
      </div>
    </div>
  );
};

const RenderContent: React.FC<{ content: string }> = ({ content }) => {
  const isCodeChunk = content.startsWith("```") && content.endsWith("```");

  if (isCodeChunk) {
    const codeLanguage = content.substring(3, content.indexOf("\n"));
    const codeContent = content.substring(
      content.indexOf("\n") + 1,
      content.lastIndexOf("```")
    );

    return (
      <SyntaxHighlighter
        customStyle={{
          backgroundColor: "#282A3A",
          padding: "0.5rem",
          borderRadius: "20px",
        }}
        language={codeLanguage || "python"}
        style={darcula}
      >
        {codeContent}
      </SyntaxHighlighter>
    );
  } else {
    // Render the content as HTML
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
