import "../../styles/layout/Header.scss";
import RoundInfo from "../sectionsGame/RoundInfo";

const Header = ({ isGame, namePlayer, turn, messageRoundInfo }) => {
  const hasRoundInfo = Boolean(messageRoundInfo?.trim());
  const isIntroGame = isGame && namePlayer && !hasRoundInfo;

  // En game: la imagen izquierda cambia según turno (cuando ya hay mensajes)
  const leftImgMode = !isGame
    ? "presenter"
    : isIntroGame
    ? "contestants"
    : turn === "computer"
    ? "computer"
    : "contestants";

  return (
    <header
      className={[
        "header",
        isGame ? "header--game" : "header--landing",
        `header--left-${leftImgMode}`,
      ].join(" ")}
    >
      {/* Izquierda (variable según pantalla/turno) */}
      <div className="header__leftImg" />

      <div className="header__center">
        {/* Landing: título normal */}
        {!isGame && <h1 className="header__title">Gira y adivina</h1>}

        {/* Game intro: texto especial */}
        {isIntroGame && (
          <h1 className="header__title header__title--intro">
            {`Suerte - ${namePlayer}, Es tu turno!`}
          </h1>
        )}

        {/* Game jugando: SOLO RoundInfo cuando haya mensaje */}
        {isGame && hasRoundInfo && (
          <RoundInfo messageRoundInfo={messageRoundInfo} />
        )}
      </div>

      {/* Derecha: SOLO en landing */}
      {!isGame && <div className="header__rightImg" />}
    </header>
  );
};

export default Header;
