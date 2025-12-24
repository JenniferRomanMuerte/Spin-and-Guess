import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import App from "./App.jsx";
import GamePage from "./gamePage.jsx";

const RootLayout = () => {
  const location = useLocation();

  // Estado global del juego
  const [namePlayer, setNamePlayer] = useState("");
  const [turn, setTurn] = useState("player"); // "player" | "computer"

  const isGame = location.pathname === "/game";

  const changeNamePlayer = (nameiNput) => setNamePlayer(nameiNput);
  const  changeTurn = (turnValue) => setTurn(turnValue);

  return (
    <>
      <Header isGame={isGame} namePlayer={namePlayer} turn={turn} />

      <Routes>
        <Route path="/" element={<App namePlayer={namePlayer} changeNamePlayer={changeNamePlayer}/>} />
        <Route
          path="/game"
          element={
            <GamePage namePlayer={namePlayer} turn={turn} changeTurn={changeTurn} />
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

export default RootLayout;
