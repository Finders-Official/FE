import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { axiosInstance } from "./lib/axiosInstance.ts";
import { setupInterceptors } from "./lib/setUpInterceptors.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

setupInterceptors(axiosInstance);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
