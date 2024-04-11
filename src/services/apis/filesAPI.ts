import axios from "axios";
import { ExtFile } from "@files-ui/react";
import { Fileobj } from "../../types";

export async function getFiles(): Promise<Fileobj[]> {
  try {
    const files = await axios.post("http://localhost:4000/getFiles", {
      userID: localStorage.getItem("userID"),
    });

    return files.data as Fileobj[];
  } catch (err) {
    return [];
  }
}

export async function deleteFile(fileID: any) {
  try {
    axios.post("http://localhost:4000/deleteFile", {
      fileID: fileID,
      userID: localStorage.getItem("userID"),
    });
  } catch (err) {
    console.log(err);
  }
}
