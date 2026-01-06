import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/Main.scss";
import rouletteImg from "../../images/roulette.webp";
import LoginForm from "../auth/LoginForm";
import { me } from "../../services/auth.service";
import storage from "../../services/localStorage";

function App({ changeNamePlayer }) {
  const [checkingSession, setCheckingSession] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();


  // Comprobamos si existe Token en localStorage
  useEffect(() => {
    const token = storage.get("token", null);

    if (token) {
      checkSession(token);
    } else {
      setCheckingSession(false);
    }
  }, []);

  // Si hay token comprobamos si es valido
  const checkSession = async (token) => {
    try {
      const data = await me(token);
      setUser(data.user);
    } catch (error) {
      // Token inválido o caducado
      storage.remove("token");
      storage.remove("user");
      setUser(null);
    } finally {
      setCheckingSession(false);
    }
  };

  // Si el token es valido se redirige a game
  useEffect(() => {
  if (user) {
    const timeoutId = setTimeout(() => {
      navigate("/game");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }
}, [user, navigate]);


  return (
    <main className="main landing">
      <article className="main__article">
        <section className="main__article--section">
          <img
            src={rouletteImg}
            alt="ruleta girando"
            className="main__article--section-img"
          />
        </section>
        {/* Botones del televisor */}
        <section className="main__article--tv-buttons">
          <button type="button" className="main__article--tv-buttons-tv-btn">
            CH+
          </button>
          <button type="button" className="main__article--tv-buttons-tv-btn">
            CH-
          </button>
          <button type="button" className="main__article--tv-buttons-tv-btn">
            VOL+
          </button>
          <button type="button" className="main__article--tv-buttons-tv-btn">
            VOL-
          </button>
          <button
            type="button"
            className="main__article--tv-buttons-tv-btn power"
          >
            ON
          </button>
        </section>
      </article>
      {checkingSession && (
        <p className="main__isSession">Comprobando sesión...</p>
      )}
      {!checkingSession && !user && (
        <LoginForm changeNamePlayer={changeNamePlayer} />
      )}
      {!checkingSession && user && (
        <p className="main__isSession">
          Bienvenida de nuevo, {user.username}
        </p>
      )}
    </main>
  );
}

export default App;
