import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import ProtectedRoute from "./PotectedRoute.jsx";

import storage from "../../services/localStorage";
import { me } from "../../services/auth.service";

import Header from "./Header.jsx";

import App from "../pages/App.jsx";
import GamePage from "../pages/GamePage/gamePage.jsx";
import Spinner from "../ui/Spinner.jsx";

import "../../styles/core/_reset.scss";

const RootLayout = () => {
  const location = useLocation();

  // Estado global del juego
  const [namePlayer, setNamePlayer] = useState("");
  const [turn, setTurn] = useState("player"); // "player" | "computer"
  const [messageRoundInfo, setMessageRoundInfo] = useState("");

  const [isBooting, setIsBooting] = useState(true);

  const isGame = location.pathname === "/game";
  const isAuthenticated = Boolean(namePlayer);

  const changeNamePlayer = (nameInput) => setNamePlayer(nameInput);
  const changeTurn = (turnValue) => setTurn(turnValue);

  const updateRoundInfo = (msg) => setMessageRoundInfo(msg);
  const clearRoundInfo = () => setMessageRoundInfo("");

  useEffect(() => {
    const token = storage.get("token");

    if (!token) {
      setIsBooting(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const data = await me();
        setNamePlayer(data.user.username);
      } catch (error) {
        storage.remove("token");
        storage.remove("user");
        setNamePlayer("");
      } finally {
        setIsBooting(false);
      }
    };

    restoreSession();
  }, []);

  if (isBooting) {
    return (
      <div className="appLayout appLayout--center">
        <Spinner text="Encendiendo el plató..." />
      </div>
    );
  }

  return (
    <div className="appLayout">
      {isGame && (
        <Header
          isGame={isGame}
          namePlayer={namePlayer}
          turn={turn}
          messageRoundInfo={messageRoundInfo}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <App namePlayer={namePlayer} changeNamePlayer={changeNamePlayer} />
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GamePage
                namePlayer={namePlayer}
                turn={turn}
                changeTurn={changeTurn}
                changeNamePlayer={changeNamePlayer}
                updateRoundInfo={updateRoundInfo}
                clearRoundInfo={clearRoundInfo}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default RootLayout;
