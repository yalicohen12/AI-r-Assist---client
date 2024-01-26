import React from "react";
import "./conversationItem.css";
import { useAppDispatch, useAppSelector } from "../../state";
import { set, newConversation } from "../../state/conversationState";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { deleteConversation } from "../../services/apis/conversationsAPI";
import { toast } from "react-toastify";

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
  const dispatch = useAppDispatch();
  function handleConversationClicked(): void {
    localStorage.setItem("conversationID", conversationID);
    dispatch(set(conversationID));
  }

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
      deleteConversationCall(conversationID)
      if (conversationID == localStorage.getItem("conversationID")) {
        dispatch(newConversation());
      }
      notify();
    } catch {
      console.log("fail");
    }
  }

  return (
    <div className="conversation-container" onClick={handleConversationClicked}>
      <div>
        <p className="con-title">{title}</p>
      </div>
      {/* <p className="con-timeStamp">{timeStamp}</p> */}
      <DeleteIcon
        className="deleteIcon"
        onClick={handleDeleteConversarion}
      ></DeleteIcon>
    </div>
  );
};

export default ConversationItem;
