import React from "react";
import App from "./components/App";
import { BrowserRouter as Router } from "react-router-dom/cjs/react-router-dom.min";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./components/userContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Router>
  <UserProvider>
    <App />
  </UserProvider>
  </Router>
);

