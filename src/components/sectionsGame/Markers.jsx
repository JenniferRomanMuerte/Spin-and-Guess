import { useLocation } from "react-router-dom";
import "../../styles/layout/sectionGame/MarkersGame.scss";

const Markers = () => {

  const location = useLocation();

  // Recuperamos el valor el nombre del jugador que está guardado en el estado
  const namePlayer = location.state?.namePlayer;

  return (
    <article className="markers">
      <section className="markers__section">
        <p className="markers__section--players">{namePlayer}</p>
        <div className="markers__section--score">000</div>
      </section>
      <section className="markers__section">
        <p className="markers__section--players">Computadora</p>
        <div className="markers__section--score">000</div>
      </section>
    </article>
  );
};

export default Markers;
