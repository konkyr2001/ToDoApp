import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Background from "./components/Background.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Background>
    <App />
  </Background>
  // </React.StrictMode>
);
