import axios from "axios";
import { toast } from "react-toastify";

let isLoggingOut = false;

const API = axios.create({
  baseURL: "http://localhost:8087",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !isLoggingOut
    ) {
      isLoggingOut = true;
      localStorage.removeItem("token");
      toast.error("⏰ Session expired. Please login again.");
      setTimeout(() => {
        window.location.href = "/Userlogin";
      }, 5000);
    }
    return Promise.reject(error);
  }
);

export default API;
