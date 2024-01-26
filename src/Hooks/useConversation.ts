import { useAppSelector } from "../state/index";

export function UseConversationSlice() {
  const selct = useAppSelector(
    (state) => state.conversationSlice.conversationID
  );
  console.log("selector: " , selct);
  return selct;
}
