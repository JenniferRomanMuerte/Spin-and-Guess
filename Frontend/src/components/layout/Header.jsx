import "../../styles/layout/Header.scss";


const Header = ({ isGame, namePlayer, turn }) => {
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
    </header>
  );
};

export default Header;
