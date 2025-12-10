// Fichero src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./components/App.jsx";
import Footer from "./components/Footer.jsx";
import GamePage from "./components/gamePage.jsx";
import Header from "./components/Header.jsx";
import "./styles/App.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
      <Footer />
    </HashRouter>
  </React.StrictMode>
);
