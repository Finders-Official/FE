import axios from "axios";

const baseURL = import.meta.env.VITE_PUBLIC_API_URL as string | undefined;

if (!baseURL) {
  // 런타임에서 바로 터뜨려서 env 누락을 초기에 잡게 함
  throw new Error("VITE_PUBLIC_API_URL is not defined. Check your .env file.");
}

export const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
