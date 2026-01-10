import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import ProtectedRoute from "./PotectedRoute.jsx";

import storage from "../../services/localStorage";
import { me } from "../../services/auth.service";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import App from "../pages/App.jsx";
import GamePage from "../pages/GamePage/gamePage.jsx";

import "../../styles/core/_reset.scss";

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();


  // Estado global del juego
  const [namePlayer, setNamePlayer] = useState("");
  const [turn, setTurn] = useState("player"); // "player" | "computer"

  const isGame = location.pathname === "/game";

  const isAuthenticated = Boolean(namePlayer);

  const changeNamePlayer = (nameiNput) => setNamePlayer(nameiNput);
  const changeTurn = (turnValue) => setTurn(turnValue);

  useEffect(() => {
    const token = storage.get("token");

    if (!token) return;

    const restoreSession = async () => {
      try {
        const data = await me();
        setNamePlayer(data.user.username);
      } catch (error) {
        storage.remove("token");
        storage.remove("user");
        setNamePlayer("");
      }
    };

    restoreSession();
  }, []);

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
      <Header isGame={isGame} namePlayer={namePlayer} turn={turn} />

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
              />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer isGame={isGame} namePlayer={namePlayer} onLogout={handleLogout} />
    </div>
  );
};

export default RootLayout;
