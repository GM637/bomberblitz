import React from "react";
import ReactDOM from "react-dom/client";
import { insertCoin } from "playroomkit";
import App from "./App.jsx";
import "./index.css";

insertCoin().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
