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

export async function downloadFile(fileID: any, filename: any) {
  try {
    const response = await axios.get(
      `http://localhost:4000/downloadFile/${fileID}`,
      {
        responseType: "blob",
      }
    );

    // Create a blob URL for the downloaded file content
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); // Set desired filename
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.log(err);
  }
}
