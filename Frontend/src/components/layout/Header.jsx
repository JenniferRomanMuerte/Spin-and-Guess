import "../../styles/layout/Header.scss";
import RoundInfo from "../sectionsGame/RoundInfo";

const Header = ({ isGame, namePlayer, turn, messageRoundInfo }) => {
  return (
    <header className="header">
      <div className="header__presenter"></div>
      <div className="header__center">
        <h1 className="header__title">
          {isGame && namePlayer
            ? turn === "player"
              ? `Suerte  - ${namePlayer}`
              : "Turno de la computadora"
            : "Gira y adivina"}
        </h1>
        {isGame && <RoundInfo messageRoundInfo={messageRoundInfo} />}
      </div>
      <div className="header__conestants"></div>
    </header>
  );
};

export default Header;
