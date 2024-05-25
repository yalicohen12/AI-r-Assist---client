import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IconButton } from "@mui/material";
import "./saveChatModal.css";
import { saveConversation } from "../../../services/apis/conversationsAPI";
import { toast } from "react-toastify";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

interface SaveChatModalProps {
  onClose: () => void;
  isOpen: boolean;
  conversationName: string;
}

export default function SaveChatModal({
  onClose,
  isOpen,
  conversationName,
}: SaveChatModalProps) {
  const [fileTitle, setFileTitle] = useState("");
  const [fileName, setFileName] = useState(conversationName);
  const [dummyText, setDummyText] = useState("");
  const [onLogin, setIsOnLogin] = useState(true);

  const [selectedValue, setSelectedValue] = useState("txt");

  if (!isOpen) {
    return null;
  }
  const notify = () => {
    toast.success("File Saved!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      theme: "dark",
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
        fileName,
        localStorage.getItem("conversationID") || "",
        dummyText,
        selectedValue
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
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="logApp" onClick={() => onClose()}>
      <div className="saveChatContainer" onClick={(e) => e.stopPropagation()}>
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
          <div className="hedline" style={{ color: "#80d41c" }}>
            Save Chat to File
          </div>
          <div className="file-title">
            <label
              style={{ color: "white", fontSize: "large" }}
              className="modaltxt"
              htmlFor="fileTitleInput"
            >
              Set File Name
            </label>
            <input
              id="fileTitleInput"
              className="title-input"
              type="text"
              value={fileName}
              placeholder={conversationName}
              onChange={(e) => setFileName(e.target.value)}
              style={{ fontFamily: "Poppins", fontSize: "1rem" }}
            />
          </div>
          <FormControl>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              style={{ color: "white", fontSize: "large" }}
            >
              File type
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={selectedValue}
              onChange={handleRadioChange}
              style={{ color: "white" }}
            >
              <FormControlLabel
                value="txt"
                control={<Radio />}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 24,
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    color: "blue",
                  },
                }}
                label="txt"
              />
              <FormControlLabel
                value="Pdf"
                control={<Radio />}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 24,
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    color: "blue",
                  },
                }}
                label="Pdf"
              />
            </RadioGroup>
          </FormControl>

          <div className="file-title">
            <div
              className="modaltxt"
              style={{
                color: "white",
                marginTop: "1rem",
                fontSize: "large",
              }}
            >
              Add an introduction
            </div>
            <textarea
              id="dummyTextInput"
              value={dummyText}
              placeholder="type an introducte"
              onChange={(e) => setDummyText(e.target.value)}
              className="textarea"
              cols={50}
              style={{
                color: "white",
                fontSize: "1rem",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <div className="Save-Chat-Btns">
            <button
              style={{ color: "white" }}
              value={"Submit"}
              onClick={handleSaveChat}
              className="save-chat-btn"
            >
              Save
            </button>
            <button
              style={{ color: "white" }}
              className="cancel-chat-btn"
              onClick={() => onClose()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
