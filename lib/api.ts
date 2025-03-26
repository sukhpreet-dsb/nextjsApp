import axios from "axios";

// Axios Interceptor Instance
export const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
