import axios from "axios";

const baseURL = import.meta.env.VITE_PUBLIC_API_URL as string | undefined;

export const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
