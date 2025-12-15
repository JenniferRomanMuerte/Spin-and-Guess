import { useState } from "react";
import "../styles/layout/GameMain.scss";
import ControlsGame from "./sectionsGame/ControlsGame";
import Markers from "./sectionsGame/Markers";
import Panel from "./sectionsGame/Panel";
import Roulette from "./sectionsGame/Roulette";

const GamePage = () => {
  // Para activar o desactivar los botones de juego
  const [choose, setChoose] = useState(true);

  // Para saber si tiene comodin
  const [hasJocker, setHasJocker] = useState(true);

  // Para saber el gajo que ha salido en la ruleta
  const [wedgeResult, setWedgeResult] = useState(null);

  // Controlamos el modal que vamos a mostrar para la accion elegida en controlsGame
  const [actionMode, setActionMode] = useState(null);

  // Función para guardar el gajo y actualizar los estados de los botones
  const spinEnd = (wedge) => {
    setWedgeResult(wedge);
    updateControls({ source: "roulette", action: wedge.label });
  };

  // Funcion para actualizar los estados de los controles
  const updateControls = ({ source, action }) => {
    if (source === "roulette") {
      setChoose(false); // tras girar, bloqueas elegir hasta que pulses algo
      setHasJocker(action !== "COMODIN"); // solo true si ha salido COMODIN
      return;
    }

    if (source === "button") {
      if (action === "Comodin") {
        setHasJocker(true);
        setChoose(true);
        setActionMode("joker");
      } else if (action === "Vocal") {
        setActionMode("vowel");
      } else if (action === "Consonante") {
        setActionMode("consonant");
      } else if (action === "Resolver") {
        setActionMode("solve");
      } else {
        setChoose(true);
      }
    }
  };

  return (
    <main className="gameMain">
      <Panel />
      <Markers />
      <Roulette spinEnd={spinEnd} actionMode={actionMode} />
      <ControlsGame
        choose={choose}
        hasJocker={hasJocker}
        updateControls={updateControls}
      />
    </main>
  );
};

export default GamePage;
