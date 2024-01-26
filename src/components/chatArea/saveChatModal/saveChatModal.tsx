import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IconButton } from "@mui/material";
import "./saveChatModal.css";
import { saveConversation } from "../../../services/apis/conversationsAPI";
import { toast } from "react-toastify";

interface SaveChatModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function SaveChatModal({ onClose, isOpen }: SaveChatModalProps) {
  const [fileTitle, setFileTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [dummyText, setDummyText] = useState("");
  const [onLogin, setIsOnLogin] = useState(true);
  if (!isOpen) {
    return null;
  }
  const notify = () => {
    toast.success("File Saved!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
  };

  const notifyIssue = () => {
    toast.error("Fail in proccess", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 6000,
    });
  };

  async function handleSaveChat() {
    try {
      const saveResponse = await saveConversation(
        fileTitle,
        localStorage.getItem("conversationID") || "",
        dummyText
      );
      if (saveResponse == "File saved") {
        setFileTitle("");
        setDummyText("");
        notify();
        onClose();
      } else {
        notifyIssue();
      }
    } catch {
      notifyIssue();
    }
  }

  return (
    <div className="logApp">
      <div className="saveChatContainer">
        <div className="close">
          <IconButton
            onClick={() => {
              onClose();
              setIsOnLogin(true);
            }}
          >
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <div className="saveChatForm">
          <div className="hedline">Save Chat to File</div>
          <div className="file-title">
            <label className="modaltxt" htmlFor="fileTitleInput">
              Set File Name
            </label>
            <input
              id="fileTitleInput"
              className="title-input"
              type="text"
              value={fileName}
              placeholder="type Name"
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="file-title">
            <label className="modaltxt" htmlFor="fileTitleInput">
              Set File Title
            </label>
            <input
              id="fileTitleInput"
              className="title-input"
              type="text"
              value={fileTitle}
              placeholder="type title"
              onChange={(e) => setFileTitle(e.target.value)}
            />
          </div>
          <div className="dropdown-container">
            <label className="modaltxt" htmlFor="folderSelect">
              Choose Folder
            </label>
            <div className="dropdown-wrapper">
              <select id="folderSelect">
                <option value="folder1">Folder 1</option>
                <option value="folder2">Folder 2</option>
              </select>
              {/* <ArrowDropDownIcon /> */}
            </div>
          </div>
          <div className="file-title">
            <div className="modaltxt">Add an introduction</div>
            <textarea
              id="dummyTextInput"
              value={dummyText}
              placeholder="type an introducte"
              onChange={(e) => setDummyText(e.target.value)}
              className="textarea"
              cols={50}
            />
          </div>

          <button
            value={"Submit"}
            onClick={handleSaveChat}
            className="save-chat-btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
