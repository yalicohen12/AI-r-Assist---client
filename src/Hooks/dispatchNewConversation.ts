import { useAppDispatch } from "../state";
import { newConversation } from "../state/conversationState";

export function UseNewConversation() {
  console.log("in safe side")
  const dispatch = useAppDispatch();
  dispatch(newConversation());
}
