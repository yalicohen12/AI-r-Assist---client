import axios from "axios";
import { newConversation, set } from "../../state/conversationState";
import store from "../../state";
import { useAppDispatch, useAppSelector } from "../../state";

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

// console.log("now: ", localStorage.getItem("token"));
// const instance = axios.create({
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

export async function getConversations(): Promise<ConversationsList[]> {
  // console.log("making call getCo");
  try {
    const conversationsResponse = await axios.post(
      "http://localhost:4000/getConversations",
      {
        userID: localStorage.getItem("userID"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return conversationsResponse.data.conversations as ConversationsList[];
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export async function getConversation() {
  // console.log("making call getCon");

  const conversationID = localStorage.getItem("conversationID");
  if (!conversationID) {
    return "missing conv id";
  }
  try {
    const conversation = await axios.post(
      "http://localhost:4000/getConversation",
      {
        conversationID: conversationID,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return conversation.data;
  } catch (err) {
    return "error sendeding messages";
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
  if (file) {
    try {
      console.log("trying to send the file");
      const formData = new FormData();
      formData.append("userID", userID || "");
      formData.append("prompt", prompt);
      formData.append("anotation", anot);
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("modelStatus", modelStatus);

      const conversation = await axios.post(
        "http://localhost:4000/createConversation",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );

      localStorage.setItem("conversationID", conversation.data.conversationID);
      return conversation.data as string;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  } else {
    const conversation = await axios.post(
      "http://localhost:4000/createConversation",
      {
        userID: userID,
        prompt: prompt,
        anotation: anot,
        file: file,
        fileName: fileName,
        modelStatus: modelStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    localStorage.setItem("conversationID", conversation.data.conversationID);
    // const dispatch = useDispatch();
    // dispatch(newConversation(conversation.data.conversationID))
    console.log(conversation.data);
    return conversation.data;
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
  // const conversationID = store.getState().conversationSlice.conversationID;
  const conversationID = localStorage.getItem("conversationID");

  if (file) {
    try {
      const formData = new FormData();
      formData.append("userID", userID || "");
      formData.append("prompt", prompt);
      formData.append("anotation", anot);
      formData.append("file", file);
      formData.append("conversationID", conversationID || "");
      formData.append("fileName", fileName);
      formData.append("modelStatus", modelStatus);

      const conversation = await axios.post(
        "http://localhost:4000/postToConversation",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );
      return conversation.data;
    } catch (error) {
      console.error("API request failed (try to send file):", error);
      throw error;
    }
  } else {
    try {
      const conversation = await axios.post(
        "http://localhost:4000/postToConversation",
        {
          userID: userID,
          conversationID: conversationID,
          prompt: prompt,
          anotation: anot,
          fileName: fileName,
          modelStatus: modelStatus,
          // file: file,
        }
        ,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
      );

      return conversation.data as string;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
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
    const response = await uploadToConversation(
      prompt,
      anot,
      file,
      fileName,
      modelStatus
    );
    return response;
  } else {
    const response = await createConversation(
      prompt,
      anot,
      file,
      fileName,
      modelStatus
    );
    return response;
  }
}

export async function deleteConversation(conID: string) {
  console.log("deleting in api");
  if (localStorage.getItem("userID")) {
    try {
      axios.post("http://localhost:4000/deleteConversation", {
        userID: localStorage.getItem("userID"),
        conversationID: conID,
      }
      ,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    
    );
      // localStorage.setItem("conversationID", "");
    } catch {}
  }
}

export async function regenerateResponse(index: number, modelStatus: string) {
  if (
    localStorage.getItem("userID") &&
    localStorage.getItem("conversationID")
  ) {
    try {
      const res = await axios.post("http://localhost:4000/regenerateResponse", {
        userID: localStorage.getItem("userID"),
        conversationID: localStorage.getItem("conversationID"),
        index: index,
        modelStatus: modelStatus,
      }
      ,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
      return res.data;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
}

export async function deleteMsg(index: number, conID: string) {
  if (localStorage.getItem("userID")) {
    try {
      axios.post("http://localhost:4000/deleteMessage", {
        userID: localStorage.getItem("userID"),
        conversationID: conID,
        index: index,
      }
      ,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    } catch (err) {
      console.log(err);
    }
  }
}

export async function saveConversation(
  title: string,
  conID: string,
  introduction: string,
  fileType: string
) {
  if (localStorage.getItem("userID")) {
    try {
      axios.post("http://localhost:4000/saveConversationFile", {
        userID: localStorage.getItem("userID"),
        conversationID: conID,
        title: title,
        introduction: introduction,
        fileType: fileType,
      }
      ,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
      return "File saved";
    } catch {
      return "error in proccess";
    }
  }
}

export async function renameConversation(
  conversationID: string,
  newName: string
) {
  if (localStorage.getItem("userID")) {
    try {
      await axios.post("http://localhost:4000/renameConversation", {
        userID: localStorage.getItem("userID"),
        conversationID: conversationID,
        newName: newName,
      }
      ,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
      return "File saved";
    } catch {
      return "error in proccess";
    }
  }
}
