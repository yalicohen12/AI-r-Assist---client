import { useAppDispatch } from '../../state'; // Adjust import path as needed
import { disConnect } from '../../state/authStatusState'; // Adjust import path as needed
import { newConversation } from '../../state/conversationState'; // Adjust import path as needed

export function useHandleLogout() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(disConnect());
    dispatch(newConversation());
    localStorage.clear();
    // navigate('/login'); // Redirect to login page
  };

  return handleLogout;
}
