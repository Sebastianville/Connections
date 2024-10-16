import React from "react";
import App from "./components/App";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./components/userContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <UserProvider>
    <App />
  </UserProvider>
);

