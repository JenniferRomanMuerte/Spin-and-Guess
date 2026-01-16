import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import focusImg from "../../images/focus.webp";
import "../../styles/layout/Main.scss";
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
    <main className="landing">
      <div className="landing__overlay" />
      <div className="landing__spots" aria-hidden="true">
       <span className="landing__spotWrap landing__spotWrap--left">
        <img
          className="landing__spot landing__spot--left"
          src={focusImg}
          alt=""
        />
        </span>
        <span className="landing__spotWrap landing__spotWrap--right">
        <img
          className="landing__spot landing__spot--right"
          src={focusImg}
          alt=""
        />
        </span>
      </div>

      <section className="landing__content">
        <h1 className="landing__title">Gira y Adivina</h1>

        {isLogged && (
          <p className="landing__welcome">Bienvenida de nuevo, {namePlayer}</p>
        )}

        {!isLogged && authMode === "login" && (
          <div className="landing__auth">
            <LoginForm changeNamePlayer={changeNamePlayer} />
            <p
              className="landing__switch"
              onClick={() => setAuthMode("register")}
            >
              ¿No tienes cuenta? Regístrate
            </p>
          </div>
        )}

        {!isLogged && authMode === "register" && (
          <div className="landing__auth">
            <RegisterForm
              onRegisterSuccess={() => {
                setAuthMode("success");
              }}
            />
            <p className="landing__switch" onClick={() => setAuthMode("login")}>
              ¿Ya tienes cuenta? Inicia sesión
            </p>
          </div>
        )}

        {authMode === "success" && (
          <p className="landing__success">Registro completado correctamente</p>
        )}
      </section>
    </main>
  );
}

export default App;
