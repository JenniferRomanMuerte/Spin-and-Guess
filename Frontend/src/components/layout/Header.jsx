import "../../styles/layout/Header.scss";
import logoutIcon from "../../images/logout.png";

const Header = ({ isGame, namePlayer, turn, onLogout }) => {
  return (
    <header className="header">
      <div className="header__presenter"></div>

        <h1 className="header__title">
          {isGame && namePlayer
            ? turn === "player"
              ? `Suerte  - ${namePlayer}`
              : "Turno de la computadora"
            : "Gira y adivina"}
        </h1>
      <div className="header__conestants"></div>
       {isGame && (
          <button
            onClick={onLogout}
            className="header__logout"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
             <img src={logoutIcon} alt="" />
          </button>
        )}
    </header>
  );
};

export default Header;
