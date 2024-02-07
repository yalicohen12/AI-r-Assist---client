import React from "react";
import "./confirmModal.css";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ConfirmModalProps {
  text: string;
  action: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfirmModal({
  text,
  action,
  isOpen,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-backround">
      <div className="modal-content">
        <div className="close">
          <IconButton
            onClick={() => {
              onClose();
            }}
          >
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <div className="modal-title">Are you sure you want to {text}</div>
        <div className="modal-btns">
          <button className="confrim-btn" onClick={action}>OK</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
