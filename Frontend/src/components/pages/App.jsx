import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/Main.scss";
import rouletteImg from "../../images/roulette.webp";
import LoginForm from "../auth/LoginForm";

function App({ changeNamePlayer }) {

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
      <LoginForm changeNamePlayer={changeNamePlayer}/>
    </main>
  );
}

export default App;
