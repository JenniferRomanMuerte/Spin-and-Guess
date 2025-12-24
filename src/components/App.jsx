// Fichero src/components/App.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/layout/Main.scss";
import rouletteImg from "../images/roulette.webp";

function App({namePlayer, changeNamePlayer}) {

  const handleName = (ev) =>{
    ev.preventDefault();
    changeNamePlayer(ev.target.value);
  }

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
          <button className="main__article--tv-buttons-tv-btn">CH+</button>
          <button className="main__article--tv-buttons-tv-btn">CH-</button>
          <button className="main__article--tv-buttons-tv-btn">VOL+</button>
          <button className="main__article--tv-buttons-tv-btn">VOL-</button>
          <button className="main__article--tv-buttons-tv-btn power">ON</button>
        </section>
      </article>
      <form className="main__form">
        <input
          type="text"
          className="main__form-inputName"
          placeholder="Introduce tu nombre"
          value={namePlayer}
          onChange={handleName}
        />
        <Link
        className="main__form-btnBegin"
        to="/game"
        >
          A jugar!
        </Link>
      </form>
    </main>
  );
}

export default App;
