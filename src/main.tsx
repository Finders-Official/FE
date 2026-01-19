import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { setupInterceptors } from "./lib/setUpInterceptors.ts";
import { axiosInstance } from "./lib/axiosInstance.ts";

setupInterceptors(axiosInstance);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
