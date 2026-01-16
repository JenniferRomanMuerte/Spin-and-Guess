import rouletteImg from "../../images/rouletteSpinner.webp";
import "../../styles/layout/ui/Spinner.scss";

const Spinner = ({ text = "Cargando..." }) => {
  return (
    <article className="spinner" role="status" aria-live="polite">
      <div className="spinner__rouletteWrap">
        <img src={rouletteImg} alt="" className="spinner__roulette" />
      </div>
      <p className="spinner__text">{text}</p>

      <div className="spinner__bar" aria-hidden="true">
        <span className="spinner__barFill" />
      </div>
    </article>
  );
};

export default Spinner;
