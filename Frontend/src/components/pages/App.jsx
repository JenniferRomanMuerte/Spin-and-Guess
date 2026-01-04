import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/Main.scss";
import rouletteImg from "../../images/roulette.webp";

function App({ namePlayer, changeNamePlayer }) {
  const navigate = useNavigate();
  const [errorName, setErrorName] = useState("");

  const isValidName = useMemo(() => namePlayer.trim().length > 0, [namePlayer]);

  const handleName = (ev) => {
    const value = ev.target.value;
    changeNamePlayer(value);
    if (value.trim().length > 0) setErrorName("");
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (!isValidName) {
      setErrorName("Debes rellenar tu nombre para continuar.");
      return;
    }

    setErrorName("");
    navigate("/game");
  };

  return (
    <main className="main landing">
      <article className="main__article">
        <section className="main__article--section">
          <img
            src={rouletteImg}
            alt="ruleta girando"
            className="main__article--section-img"
          />
        </section>
        {/* Botones del televisor */}
        <section className="main__article--tv-buttons">
          <button type="button" className="main__article--tv-buttons-tv-btn">
            CH+
          </button>
          <button type="button" className="main__article--tv-buttons-tv-btn">
            CH-
          </button>
          <button type="button" className="main__article--tv-buttons-tv-btn">
            VOL+
          </button>
          <button type="button" className="main__article--tv-buttons-tv-btn">
            VOL-
          </button>
          <button
            type="button"
            className="main__article--tv-buttons-tv-btn power"
          >
            ON
          </button>
        </section>
      </article>
      <form className="main__form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          className={`main__form-inputName ${errorName ? "is-error" : ""}`}
          placeholder="Introduce tu nombre"
          value={namePlayer}
          onChange={handleName}
          aria-invalid={!!errorName}
          aria-describedby="name-error"
        />
        {errorName && (
          <p id="name-error" className="main__form-error" role="alert">
            {errorName}
          </p>
        )}
        <button
          type="submit"
          className={`main__form-btnBegin ${!isValidName ? "is-disabled" : ""}`}
          aria-disabled={!isValidName}
        >
          A jugar!
        </button>
      </form>
    </main>
  );
}

export default App;
