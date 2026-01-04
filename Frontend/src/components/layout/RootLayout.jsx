import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import App from "../pages/App.jsx";
import GamePage from "../pages/gamePage.jsx";

import "../../styles/core/_reset.scss";

const RootLayout = () => {
  const location = useLocation();

  // Estado global del juego
  const [namePlayer, setNamePlayer] = useState("");
  const [turn, setTurn] = useState("player"); // "player" | "computer"

  const isGame = location.pathname === "/game";

  const changeNamePlayer = (nameiNput) => setNamePlayer(nameiNput);
  const  changeTurn = (turnValue) => setTurn(turnValue);

  return (
    <div className="appLayout">
      <Header isGame={isGame} namePlayer={namePlayer} turn={turn} />

      <Routes>
        <Route path="/" element={<App namePlayer={namePlayer} changeNamePlayer={changeNamePlayer}/>} />
        <Route
          path="/game"
          element={
            <GamePage namePlayer={namePlayer} turn={turn} changeTurn={changeTurn} changeNamePlayer={changeNamePlayer}/>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default RootLayout;
