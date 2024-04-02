import React, { useState } from "react";
import "./conversationItem.css";
import { useAppDispatch, useAppSelector } from "../../../state";
import { set, newConversation } from "../../../state/conversationState";
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
  const [editableTitle, setEditableTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const deleteText = " want to delete this conversation? ";

  const [fromDelete, setFromDelete] = useState(false);

  const notify = () => {
    toast.success("conversation deleted", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  function handleConversationClicked(): void {
    // console.log("clicked");
    if (!fromDelete) {
      // console.log("clicked2");
      localStorage.setItem("conversationID", conversationID);
      dispatch(set(conversationID));
    }
    setFromDelete(false);
  }

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleSaveEdit() {
    // Save the edited title
    // Call an API to update the conversation title
    setIsEditing(false);
  }

  function handleCancelEdit() {
    // Cancel the edit and revert back to original title
    setEditableTitle(title);
    setIsEditing(false);
  }

  function handleDelete(event: React.MouseEvent) {
    console.log("dd");
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
            onBlur={handleSaveEdit}
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
                flexDirection: "column",
                gap: "0.7rem",
                color: "transparent",
              }}
            >
              <IconButton
                className="confirmIcon"
                onClick={handleSaveEdit}
                style={{ height: "1rem" }}
              >
                <CheckIcon color="primary" />
              </IconButton>
              <IconButton onClick={handleCancelEdit} style={{ height: "1rem" }}>
                <CloseIcon color="error" />
              </IconButton>
            </div>
          </>
        ) : (
          <EditIcon
            color="primary"
            style={{ marginLeft: "auto", fontSize: "1.1rem" }}
            className="editIcon"
            onClick={handleEditClick}
          ></EditIcon>
        )}
      </div>

      <div className="casefDelete" onClick={(event) => handleDelete(event)}>
        <DeleteIcon
          style={{ fontSize: "1.1rem" }}
          className="deleteIcon"
          // onClick={handleDelete}
        ></DeleteIcon>
      </div>
    </div>
  );
};

export default ConversationItem;
