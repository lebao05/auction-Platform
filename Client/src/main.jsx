import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AdminProvider } from "./contexts/AdminContext.jsx";
import { ProductProvider } from "./contexts/ProductMagementContext.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import React-Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WatchListProvider from "./contexts/WatchListContext.jsx";
import { ChatProvider } from "./contexts/chatContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <ProductProvider>
            <WatchListProvider>
              <ChatProvider>
                <App />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </ChatProvider>
            </WatchListProvider>
          </ProductProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
