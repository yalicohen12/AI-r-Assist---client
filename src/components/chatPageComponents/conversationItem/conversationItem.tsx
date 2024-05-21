import React, { useState } from "react";
import "./conversationItem.css";
import { useAppDispatch, useAppSelector } from "../../../state";
import {
  set,
  newConversation,
  setConversationName,
} from "../../../state/conversationState";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { deleteConversation } from "../../../services/apis/conversationsAPI";
import { toast } from "react-toastify";
import ConfirmModal from "../../confirmModal/confirmModal";
// import { makeStyles } from "@material-ui/core/styles";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { renameConversation } from "../../../services/apis/conversationsAPI";
import SaveIcon from "@mui/icons-material/Save";

interface ConversationItemProps {
  title: string;
  timeStamp: string;
  conversationID: string;
  deleteConversationCall: (conID: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  title,
  timeStamp,
  conversationID,
  deleteConversationCall,
}) => {
  const conID = useAppSelector(
    (state) => state.conversationSlice.conversationID
  );
  const dispatch = useAppDispatch();
  const [originalTitle, setOriginalTitle] = useState(title);
  const [editableTitle, setEditableTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const deleteText = " want to delete this conversation? ";

  const [fromDelete, setFromDelete] = useState(false);

  const isStreaming = useAppSelector(
    (state) => state.streamingSlice.isStreaming
  );

  const notify = () => {
    toast.success("conversation deleted", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "dark",
    });
  };

  const notifyStreamingWait = () => {
    toast.info("please wait until message will finish load", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "dark",
    });
  };

  function handleConversationClicked(): void {
    // console.log(isStreaming)
    if (!isStreaming) {
      if (!fromDelete) {
        localStorage.setItem("conversationID", conversationID);
        dispatch(set(conversationID));
        dispatch(setConversationName(title));
      }
      setFromDelete(false);
    } else {
      if (!fromDelete) {
        setFromDelete(false);
      }
      notifyStreamingWait();
    }
  }

  function handleEditClick(event: React.MouseEvent) {
    setFromDelete(true);
    event.stopPropagation();
    setIsEditing(true);
  }

  function handleSaveEdit() {
    // Save the edited title
    // Call an API to update the conversation title
    renameConversation(conversationID, editableTitle);
    setOriginalTitle(editableTitle);

    setIsEditing(false);
  }

  function handleCancelEdit() {
    // Cancel the edit and revert back to original title
    setEditableTitle(originalTitle);
    setIsEditing(false);
  }

  function handleDelete(event: React.MouseEvent) {
    // console.log("dd");
    setFromDelete(true);
    event.stopPropagation();
    setIsOpen(true);
  }

  function handleDeleteConversarion() {
    try {
      // event.stopPropagation();
      deleteConversationCall(conversationID);
      deleteConversation(conversationID);
      notify();
    } catch {
      console.log("fail");
    }
  }

  return (
    <div
      onClick={handleConversationClicked}
      className={`conversation-container ${
        conID === conversationID ? "special-style" : ""
      }`}
    >
      <ConfirmModal
        isOpen={isOpen}
        action={() => handleDeleteConversarion()}
        onClose={() => setIsOpen(false)}
        text={deleteText}
      ></ConfirmModal>
      <div className="con-title-container">
        {isEditing ? (
          <TextField
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            // onBlur={handleSaveEdit}
            autoFocus
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              style: { color: "white" },
            }}
          />
        ) : (
          <div className="con-title">{editableTitle}</div>
        )}
      </div>
      <div className="casef">
        {isEditing ? (
          <>
            <div
              style={{
                display: "flex",
                // flexDirection: "column",
                gap: "0.7rem",
                color: "transparent",
              }}
            >
              <IconButton className="confirmIcon" onClick={handleSaveEdit}>
                <CheckIcon color="primary" style={{ fontSize: "1rem" }} />
              </IconButton>
              <IconButton onClick={handleCancelEdit}>
                <CloseIcon color="error" style={{ fontSize: "1rem" }} />
              </IconButton>
            </div>
          </>
        ) : (
          <EditIcon
            color="primary"
            style={{ marginLeft: "auto", fontSize: "1.1rem" }}
            className="editIcon"
            onClick={(event) => handleEditClick(event)}
          ></EditIcon>
        )}
      </div>
      <div className="casef2">
        <IconButton
          className="casefDelete"
          onClick={(event) => handleDelete(event)}
        >
          <DeleteIcon
            style={{ fontSize: "1.1rem" }}
            className="deleteIcon"
            // onClick={handleDelete}
          ></DeleteIcon>
        </IconButton>
      </div>
      {/* <div className="casef2">
        <IconButton
          className="casefDelete"
          onClick={(event) => handleDelete(event)}
        >
          <SaveIcon
            style={{ fontSize: "1.1rem" }}
            className="saveIcon"
            // onClick={handleDelete}
          ></SaveIcon>
        </IconButton>
      </div> */}
    </div>
  );
};

export default ConversationItem;
