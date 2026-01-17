import { pluralize } from "../../pages/GamePage/utils/gameUtils";

const JokerPanel = ({ resolveJoker, jockerPlayerCount }) => {
  return (
    <div className="jockerPanel">
      <h3 className="jockerPanel__title">💥 ¡Quiebra!</h3>

      <p className="jockerPanel__info">
        Has caído en <strong>QUIEBRA</strong>.
      </p>

      <p className="jockerPanel__info">
        Tienes{" "}
        <span className="jockerPanel__info--strong">{jockerPlayerCount}</span>{" "}
        {pluralize(jockerPlayerCount, "comodín", "comodines")}.
      </p>

      <p className="jockerPanel__question">¿Quieres usar uno para salvarte?</p>

      <div className="jockerPanel__actions">
        <button
          className="jockerPanel__actions--btn jockerPanel__actions--btn-primary"
          onClick={() => resolveJoker(true)}
        >
          Usar comodín
        </button>

        <button
          className="jockerPanel__actions--btn"
          onClick={() => resolveJoker(false)}
        >
          Aceptar quiebra
        </button>
      </div>
    </div>
  );
};

export default JokerPanel;
