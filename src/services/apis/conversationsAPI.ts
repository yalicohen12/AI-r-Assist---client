import axios, { AxiosError } from "axios";
import { newConversation, set } from "../../state/conversationState";
import store from "../../state";
import { useAppDispatch, useAppSelector } from "../../state";
import { axiosInstance } from "../apis/axiosInstacne";
import { handleApiError } from "./ErrorHandler";
interface Conversation {
  conversationId: String;
  questions: String[];
  answers: String[];
  title: String;
}

interface ConversationsList {
  title: string;
  timestamp: string;
  conversationID: string;
}

interface ErrorResponseData {
  message: string;
  // Add other properties if needed
}

export async function getConversations(): Promise<ConversationsList[]> {
  try {
    const conversationsResponse = await axiosInstance.post("/getConversations", {
      userID: localStorage.getItem("userID"),
    });

    return conversationsResponse.data.conversations as ConversationsList[];
  } catch (error) {
    handleApiError(error as AxiosError<ErrorResponseData>)
    console.error("API request failed:", error);
    throw error;
  }
}

export async function getConversation() {
  const conversationID = localStorage.getItem("conversationID");
  if (!conversationID) {
    return "missing conv id";
  }
  try {
    const conversation = await axiosInstance.post("/getConversation", {
      conversationID,
    });

    return conversation.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export async function createConversation(
  prompt: string,
  anot: string,
  file: File | null,
  fileName: string,
  modelStatus: string
) {
  const userID = localStorage.getItem("userID");

  try {
    const formData = new FormData();
    formData.append("userID", userID || "");
    formData.append("prompt", prompt);
    formData.append("anotation", anot);
    if (file) {
      formData.append("file", file);
    }
    formData.append("fileName", fileName);
    formData.append("modelStatus", modelStatus);

    const conversation = await axiosInstance.post("/createAPIConversation", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    localStorage.setItem("conversationID", conversation.data.conversationID);
    return conversation.data as string;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export async function uploadToConversation(
  prompt: string,
  anot: string,
  file: File | null,
  fileName: string,
  modelStatus: string
) {
  const userID = localStorage.getItem("userID");
  const conversationID = localStorage.getItem("conversationID");

  try {
    const formData = new FormData();
    formData.append("userID", userID || "");
    formData.append("prompt", prompt);
    formData.append("anotation", anot);
    if (file) {
      formData.append("file", file);
    }
    formData.append("conversationID", conversationID || "");
    formData.append("fileName", fileName);
    formData.append("modelStatus", modelStatus);

    const conversation = await axiosInstance.post("/postToAPIConversation", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return conversation.data;
  } catch (error) {
    console.error("API request failed (try to send file):", error);
    throw error;
  }
}

export async function handleNewQuestion(
  prompt: string,
  anot: string,
  file: File | null,
  fileName: string,
  modelStatus: string
) {
  if (localStorage.getItem("conversationID")) {
    return await uploadToConversation(prompt, anot, file, fileName, modelStatus);
  } else {
    return await createConversation(prompt, anot, file, fileName, modelStatus);
  }
}

export async function deleteConversation(conID: string) {
  try {
    await axiosInstance.post("/deleteConversation", {
      userID: localStorage.getItem("userID"),
      conversationID: conID,
    });
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export async function regenerateResponse(index: number, modelStatus: string) {
  index = index % 2 === 0 ? index + 1 : index;

  try {
    const res = await axiosInstance.post("/APIRegenerateResponse", {
      userID: localStorage.getItem("userID"),
      conversationID: localStorage.getItem("conversationID"),
      index,
      modelStatus,
    });

    return res.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export async function deleteMsg(index: number, conID: string) {
  try {
    await axiosInstance.post("/deleteMessage", {
      userID: localStorage.getItem("userID"),
      conversationID: conID,
      index,
    });
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export async function saveConversation(
  title: string,
  conID: string,
  introduction: string,
  fileType: string
) {
  try {
    await axiosInstance.post("/saveConversationFile", {
      userID: localStorage.getItem("userID"),
      conversationID: conID,
      title,
      introduction,
      fileType,
    });

    return "File saved";
  } catch (error) {
    console.error("API request failed:", error);
    return "error in process";
  }
}

export async function renameConversation(
  conversationID: string,
  newName: string
) {
  try {
    await axiosInstance.post("/renameConversation", {
      userID: localStorage.getItem("userID"),
      conversationID,
      newName,
    });

    return "File saved";
  } catch (error) {
    console.error("API request failed:", error);
    return "error in process";
  }
}