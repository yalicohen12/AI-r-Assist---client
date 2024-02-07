import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yLight , a11yDark, darcula} from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./message.css";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface MessageProps {
  sender: string;
  value: string;
}

const DisplayMessage: React.FC<MessageProps> = ({ sender, value }) => {
  const isUserSender = sender === "You";

  const chunks = value.split(/(```[^`]+```)/g);

  return (
    <div className="message-container">
      <div className="msg-head">
        <IconButton>
          {isUserSender ? (
            <AccountCircleIcon style={{fontSize:"2rem"}}className="userIcon" color="primary" />
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
        {chunks.map((chunk, index) => {
          const isCodeChunk = chunk.startsWith("```") && chunk.endsWith("```");
          if (isCodeChunk) {
            const codeLanguage = chunk.substring(3, chunk.indexOf("\n"));
            const codeContent = chunk.substring(chunk.indexOf("\n") + 1, chunk.lastIndexOf("```"));
            return (
              <SyntaxHighlighter customStyle={{ backgroundColor: '#282A3A' ,padding: '0.5rem' , borderRadius: '20px' }} 
              key={index} language={codeLanguage|| "python"} style={darcula}>
                {codeContent}
              </SyntaxHighlighter>
            );
          } else {
            return (
              <div key={index} dangerouslySetInnerHTML={{ __html: chunk.replace(/\n/g, "<br />") }} />
            );
          }
        })}
      </div>
    </div>
  );
};

export default DisplayMessage;
