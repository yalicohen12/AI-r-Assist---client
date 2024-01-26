import axios from "axios";
import { newConversation, set } from "../../state/conversationState";
import store from "../../state";
import { useAppDispatch, useAppSelector } from "../../state";
import { UseConversationSlice } from "../../Hooks/useConversation";
import { UseNewConversation } from "../../Hooks/dispatchNewConversation";
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

export async function getConversations(): Promise<ConversationsList[]> {
  try {
    const conversationsResponse = await axios.post(
      "http://localhost:4000/getConversations",
      {
        userID: localStorage.getItem("userID"),
      }
    );

    return conversationsResponse.data.conversations as ConversationsList[];
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export async function getConversation() {
  // const currentConversationID =
  //   store.getState().conversationSlice.conversationID;
  // const conversationID = currentConversationID;
  const conversationID = localStorage.getItem("conversationID");
  if (!conversationID) {
    return "missing conv id";
  }
  try {
    const conversation = await axios.post(
      "http://localhost:4000/getConversation",
      {
        conversationID: conversationID,
      }
    );
    return conversation.data.messages;
  } catch (err) {
    return "error sendeding messages";
  }
}

export async function createConversation(prompt: string) {
  const userID = localStorage.getItem("userID");
  try {
    const conversation = await axios.post(
      "http://localhost:4000/createConversation",
      {
        userID: userID,
        prompt: prompt,
      }
    );
    localStorage.setItem("conversationID", conversation.data.conversationID);
    // const dispatch = useDispatch();
    // dispatch(newConversation(conversation.data.conversationID))
    return conversation.data.aiResponse as string;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export async function uploadToConversation(prompt: string) {
  const userID = localStorage.getItem("userID");
  // const conversationID = store.getState().conversationSlice.conversationID;
  const conversationID = localStorage.getItem("conversationID");
  try {
    const conversation = await axios.post(
      "http://localhost:4000/postToConversation",
      {
        userID: userID,
        conversationID: conversationID,
        prompt: prompt,
      }
    );
    return conversation.data.aiResponse as string;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export async function handleNewQuestion(prompt: string) {
  // console.log("wating")
  // const conversationID  = UseConversationSlice();
  // console.log(conversationID);

  if (localStorage.getItem("conversationID")) {
    const response = await uploadToConversation(prompt);
    return response;
  } else {
    const response = await createConversation(prompt);
    return response;
  }
}

export async function deleteConversation(conID: string) {
  if (localStorage.getItem("userID")) {
    try {
      axios.post("http://localhost:4000/deleteConversation", {
        userID: localStorage.getItem("userID"),
        conversationID: conID,
      });
    } catch {}
  }
}

export async function saveConversation(
  title: string,
  conID: string,
  introduction: string
) {
  if (localStorage.getItem("userID")) {
    try {
      axios.post("http://localhost:4000/saveConversationFile", {
        userID: localStorage.getItem("userID"),
        conversationID: conID,
        title: title,
        introduction: introduction,
      });
      return "File saved"
    } catch {
      return "error in proccess"
    }
  }
}
