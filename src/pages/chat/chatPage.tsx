import React, { useEffect, useState } from "react";
import "./chatPage.css";
import Sidebar from "../../components/sidebar/sidebar";
import ChatArea from "../../components/chatArea/chatArea";

export default function ChatPage() {
  const [isChatStarted, setChatStarted] = useState(false);
  const [userMessage, setUserMessage] = useState("");

  const handleStartChat = (message: string) => {
    setUserMessage(message);
    setChatStarted(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      localStorage.removeItem("conversationID");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="main-container">
      <Sidebar />
      <ChatArea></ChatArea>
    </div>
  );
}
