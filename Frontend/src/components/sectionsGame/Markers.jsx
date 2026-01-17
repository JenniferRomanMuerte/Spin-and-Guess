
import "../../styles/layout/sectionGame/MarkersGame.scss";
import jokerIcon from "../../images/joker.webp";

const Markers = ({
  namePlayer,
  playerScore,
  computerScore,
  jockerPlayerCount,
  jockerComputerCount,
}) => {
  return (
    <article className="markers">
      <section className="markers__section">
        <p className="markers__section--players">{namePlayer}</p>
        <div className="markers__section--info">
          <div className="markers__section--info--score">{playerScore}</div>
          <div className="markers__section--info--joker">
             <img className="markers__section--info--joker--img" src={jokerIcon} alt="" />
             <p className="markers__section--info--joker--count"> x{jockerPlayerCount}</p>
          </div>
        </div>
      </section>
      <section className="markers__section">
        <p className="markers__section--players">Computadora</p>
        <div className="markers__section--info">
          <div className="markers__section--info--score">{computerScore}</div>
          <div className="markers__section--info--joker">
             <img className="markers__section--info--joker--img" src={jokerIcon} alt="" />
             <p className="markers__section--info--joker--count"> x{jockerComputerCount}</p>
          </div>
        </div>
      </section>
    </article>
  );
};

export default Markers;
