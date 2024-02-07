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
  function handleConversationClicked(): void {
    localStorage.setItem("conversationID", conversationID);
    dispatch(set(conversationID));
  }

  //modal handle
  const [isOpen, setIsOpen] = useState(false);
  const deleteText = " want to delete this conversation? ";

  const notify = () => {
    toast.success("conversation deleted", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  function handleDeleteConversarion(event: React.MouseEvent) {
    try {
      event.stopPropagation();
      deleteConversation(conversationID);
      deleteConversationCall(conversationID);
      if (conversationID == localStorage.getItem("conversationID")) {
        dispatch(newConversation());
      }
      notify();
    } catch {
      console.log("fail");
    }
  }

  return (
    <div
      className={`conversation-container ${
        conID === conversationID ? "special-style" : ""
      }`}
      onClick={handleConversationClicked}
    >
      {/* <ConfirmModal
        isOpen={isOpen}
        action={()=> handleDeleteConversarion()}
        onClose={() => setIsOpen(false)}
        text={deleteText}
      ></ConfirmModal> */}
      <div>
        <p className="con-title">{title}</p>
      </div>
      <IconButton
        style={{ marginLeft: "auto", backgroundColor: "rgb(4, 1, 20)" }}
      >
        <EditIcon
          color="primary"
          style={{ marginLeft: "auto", fontSize: "1.1rem" }}
        ></EditIcon>
      </IconButton>

      <IconButton
        className="delete-icon-btn"
        style={{ backgroundColor: "rgb(4, 1, 20)" }}
        onClick={()=> handleDeleteConversarion}

      >
        <DeleteIcon
          style={{ fontSize: "1.1rem" }}
          className="deleteIcon"
          onClick={handleDeleteConversarion}
        ></DeleteIcon>
      </IconButton>
    </div>
  );
};

export default ConversationItem;
