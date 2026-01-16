import "../../styles/layout/Header.scss";
import RoundInfo from "../sectionsGame/RoundInfo";

const Header = ({ namePlayer, turn, messageRoundInfo }) => {
  const hasRoundInfo = Boolean(messageRoundInfo?.trim());
  const isIntroGame = Boolean(namePlayer) && !hasRoundInfo;

  const leftImgMode = isIntroGame
    ? "contestants"
    : turn === "computer"
    ? "computer"
    : "contestants";

  return (
    <header className={["header", `header--left-${leftImgMode}`].join(" ")}>
      <div className="header__leftImg" />

      <div className="header__center">
        {isIntroGame ? (
          <h1 className="header__title header__title--intro">
            {`Suerte - ${namePlayer}, Es tu turno!`}
          </h1>
        ) : (
          hasRoundInfo && <RoundInfo messageRoundInfo={messageRoundInfo} />
        )}
      </div>

      {/* Spacer para centrar el bloque central */}
      <div className="header__rightSpacer" />
    </header>
  );
};

export default Header;
