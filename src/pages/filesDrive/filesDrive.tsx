import React, { useEffect, useState } from "react";
import TabsNav from "../../components/tabsNavigation/tabs";
import "./filesDrive.css";
import FolderIcon from "@mui/icons-material/Folder";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../../state";
import { setFile } from "../../state/fileState";

import {
  FileCard,
  ExtFile,
  FilesUiProvider,
  FileMosaic,
} from "@files-ui/react";
import {
  deleteFile,
  downloadFile,
  getFiles,
} from "../../services/apis/filesAPI";
import ConfirmModal from "../../components/confirmModal/confirmModal";
import { newConversation } from "../../state/conversationState";
import { useNavigate } from "react-router-dom";
import { setPage } from "../../state/pageState";
import { Fileobj } from "../../types";

export default function FileDrive() {
  const [files, setFiles] = useState<Fileobj[]>([]);

  const [currentFileID, setCurrentFileID] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<Fileobj[]>([]);

  const [chatFiles, setChatFiles] = useState<Fileobj[]>([]);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const notify = () => {
    toast.success("file deleted", {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
      theme: "dark",
    });
  };

  useEffect(() => {
    const fetchFiles = async () => {
      console.log("fetching files");
      const filesList = await getFiles();
      setFiles(filesList);
      // console.log(filesList);

      const uploadList = filesList.filter((file) => !file.chatIndicator);
      setUploadedFiles(uploadList);

      const chatFilesList = filesList.filter((file) => file.chatIndicator);
      setChatFiles(chatFilesList);
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    dispatch(setPage("Files"));
  }, []);

  function handleDeleteClick(fileId: any) {
    setCurrentFileID(fileId);
    console.log("deleting");
    setConfirmDelete(true);
  }

  function removeFile(): void {
    const updatedFiles = files.filter((file) => file.id !== currentFileID);
    setFiles(updatedFiles);

    const uploadList = updatedFiles.filter((file) => !file.chatIndicator);
    setUploadedFiles(uploadList);

    const chatFilesList = updatedFiles.filter((file) => file.chatIndicator);
    setChatFiles(chatFilesList);
    
    // notify();
    deleteFile(currentFileID);
    notify();
    setCurrentFileID("");
    setConfirmDelete(false);
  }

  function handleChatAgainClick(fileName: any) {
    dispatch(setFile(fileName));
    dispatch(newConversation());
    navigate("/");
  }

  if (files.length == 0) {
    return (
      <div className="filePage">
        <TabsNav></TabsNav>
        <div className="no-file">No Files Yet</div>
      </div>
    );
  }

  async function handleDownload(fileID: any, fileName: any): Promise<void> {
    await downloadFile(fileID, fileName);
  }

  return (
    <div className="filePage">
      {confirmDelete && (
        <ConfirmModal
          text="delete this File? it won't be available any longer"
          action={() => removeFile()}
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
        ></ConfirmModal>
      )}
      <div>
        <TabsNav />
      </div>
      <div className="myFiles-area-container">
        <div className="filesHeadline">
          My uploaded Files ({uploadedFiles.length})
        </div>
        <div className="files-container" style={{ overflow: "auto" }}>
          <FilesUiProvider config={{ darkMode: true }}>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="file-render-card">
                <div style={{ marginLeft: "0rem" }}>
                  <FileMosaic
                    id={file.id}
                    name={file.name}
                    size={file.size}
                    // type={file.type}
                    type="text/plain"
                    // downloadUrl=""
                    onDownload={() => handleDownload(file.id, file.name)}
                    onDelete={() => handleDeleteClick(file.id)}
                  />
                </div>
                <button
                  className="continue-chat"
                  onClick={() => handleChatAgainClick(file.name)}
                >
                  Chat again
                </button>
                {/* <button className="download-btn">Download</button> */}
              </div>
            ))}
          </FilesUiProvider>
        </div>
      </div>
      <div className="line"></div>
      <div className="myFiles-area-container">
        <div className="filesHeadline">My saved Chats ({chatFiles.length})</div>
        <div className="files-container">
          <FilesUiProvider config={{ darkMode: true }}>
            {chatFiles.map((file) => (
              <div key={file.id} className="file-render-card">
                <div style={{ marginLeft: "0.0rem" }}>
                  <FileMosaic
                    id={file.id}
                    name={file.name}
                    size={file.size}
                    type="text/plain"
                    // type={file.type}
                    onDelete={() => handleDeleteClick(file.id)}
                    // downloadUrl=""
                    onDownload={() => handleDownload(file.id, file.name)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginLeft: "4.2rem",
                  }}
                >
                  {/* <button className="download-btn">Download</button> */}
                </div>
              </div>
            ))}
          </FilesUiProvider>
        </div>
      </div>
    </div>
  );
}
