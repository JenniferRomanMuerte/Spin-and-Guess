import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/layout/Main.scss";
import rouletteImg from "../../images/roulette.webp";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";

function App({ namePlayer, changeNamePlayer }) {
  const [authMode, setAuthMode] = useState("login");
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState("");

  const navigate = useNavigate();

  // Si existe namePlayer está logueado
  const isLogged = Boolean(namePlayer);

  // Se redirige a game
  useEffect(() => {
  if (isLogged) {
    const timeout = setTimeout(() => {
      navigate("/game");
    }, 2000);

    return () => clearTimeout(timeout);
  }
}, [isLogged, navigate]);

  // Si se registra correctamente muestra el mensaje
  useEffect(() => {
    if (authMode === "success") {
      const timeout = setTimeout(() => {
        setRegisterSuccessMsg("");
        setAuthMode("login");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [authMode]);

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
      {isLogged && (
        <p className="main__isSession">Bienvenida de nuevo, {namePlayer}</p>
      )}
      {!isLogged && authMode === "success" && (
        <p className="main__success">Registro completado correctamente</p>
      )}
      {!isLogged && authMode === "login" && (
        <div className="main__auth">
          <LoginForm changeNamePlayer={changeNamePlayer} />
          <p
            className="main__auth--message"
            onClick={() => setAuthMode("register")}
          >
            ¿No tienes cuenta? Regístrate
          </p>
        </div>
      )}

      {!isLogged && authMode === "register" && (
        <div className="main__auth">
          <RegisterForm
            onRegisterSuccess={() => {
              setRegisterSuccessMsg(
                "Registro completado. Ahora puedes iniciar sesión."
              );
              setAuthMode("success");
            }}
          />
          <p
            className="main__auth--message"
            onClick={() => setAuthMode("login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </p>
        </div>
      )}
    </main>
  );
}

export default App;
