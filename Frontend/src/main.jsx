// Fichero src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter} from "react-router-dom";
import "./styles/App.scss";
import RootLayout from "./components/layout/RootLayout.jsx";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <RootLayout/>
    </HashRouter>
  </React.StrictMode>
);
