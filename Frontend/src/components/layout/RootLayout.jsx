import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import storage from "../../services/localStorage";
import { useNavigate } from "react-router-dom";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import App from "../pages/App.jsx";
import GamePage from "../pages/gamePage.jsx";

import "../../styles/core/_reset.scss";

const RootLayout = () => {
  const location = useLocation();

  const navigate = useNavigate();

  // Estado global del juego
  const [namePlayer, setNamePlayer] = useState("");
  const [turn, setTurn] = useState("player"); // "player" | "computer"

  const isGame = location.pathname === "/game";

  const changeNamePlayer = (nameiNput) => setNamePlayer(nameiNput);
  const changeTurn = (turnValue) => setTurn(turnValue);

  // Funcion para cerra sesión
  const handleLogout = () => {
    storage.remove("token");
    storage.remove("user");

    setNamePlayer("");
    setTurn("player");

    navigate("/");
  };

  return (
    <div className="appLayout">
      <Header isGame={isGame} namePlayer={namePlayer} turn={turn}/>

      <Routes>
        <Route path="/" element={<App changeNamePlayer={changeNamePlayer} />} />
        <Route
          path="/game"
          element={
            <GamePage
              namePlayer={namePlayer}
              turn={turn}
              changeTurn={changeTurn}
              changeNamePlayer={changeNamePlayer}
            />
          }
        />
      </Routes>

      <Footer isGame={isGame} namePlayer={namePlayer} onLogout={handleLogout}/>
    </div>
  );
};

export default RootLayout;
