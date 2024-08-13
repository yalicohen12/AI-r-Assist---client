import { axiosInstance } from './axiosInstacne';
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useHandleLogout } from '../actions/logOut';

interface ErrorResponseData {
    message: string;
  }

export const handleApiError = (error: AxiosError<ErrorResponseData>): void => {
//   const navigate = useNavigate();

  if (error.response) {
    if (error.response.status === 401) {
      if (error.response.data?.message === "Token expired, please log in again") {
        // Token expired, redirect to login
        alert("Session expired. Please log in again.");
        // useHandleLogout()
        // navigate("/login");
      } else {
        // Handle other 401 errors
        alert("Unauthorized access.");
      }
    } else {
      // Handle other response errors
      console.error("API Error: ", error.response.data?.message || error.response.statusText);
      alert(error.response.data?.message || "An error occurred. Please try again.");
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error("No response from server:", error.request);
    alert("No response from server. Please check your connection.");
  } else {
    // Something happened in setting up the request
    console.error("Error:", error.message);
    alert("An error occurred. Please try again.");
  }
};
