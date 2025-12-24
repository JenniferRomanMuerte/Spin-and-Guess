
import RoundInfo from "./RoundInfo";
import "../../styles/layout/sectionGame/MarkersGame.scss";

const Markers = ({ namePlayer, playerScore, computerScore, messageRoundInfo}) => {


  return (
    <article className="markers">
      <section className="markers__section">
        <p className="markers__section--players">{namePlayer}</p>
        <div className="markers__section--score">{playerScore}</div>
      </section>
      <RoundInfo  messageRoundInfo = {messageRoundInfo}></RoundInfo>
      <section className="markers__section">
        <p className="markers__section--players">Computadora</p>
        <div className="markers__section--score">{computerScore}</div>
      </section>
    </article>
  );
};

export default Markers;
