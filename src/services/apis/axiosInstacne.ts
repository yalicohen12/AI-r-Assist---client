import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:4000", // Default base URL for all requests
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });