import { useLocation } from "react-router-dom";
import "../styles/layout/Header.scss";

const Header = () => {

  const location = useLocation();

  // Recuperamos el valor el nombre del jugador que está guardado en el estado
  const namePlayer = location.state?.namePlayer;

  // Comprobamos en que ruta estamos
  const isGame = location.pathname === "/game";

  return (
    <header className="header">
      <div className="header__presenter"></div>
      <h2 className="header__title">
       {isGame && namePlayer ? `Suerte  ${namePlayer}` : "Gira y adivina"}
      </h2>
      <div className="header__conestants"></div>
    </header>
  );
};

export default Header;
