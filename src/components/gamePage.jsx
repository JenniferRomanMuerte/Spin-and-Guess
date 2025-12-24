import { useState } from "react";
import "../styles/layout/GameMain.scss";
import ControlsGame from "./sectionsGame/ControlsGame";
import Markers from "./sectionsGame/Markers";
import Panel from "./sectionsGame/Panel";
import Roulette from "./sectionsGame/Roulette";

const initialVowels = [
  { letter: "A", enabled: true },
  { letter: "E", enabled: true },
  { letter: "I", enabled: true },
  { letter: "O", enabled: true },
  { letter: "U", enabled: true },
];

const initialConsonants = [
  { letter: "B", enabled: true },
  { letter: "C", enabled: true },
  { letter: "D", enabled: true },
  { letter: "F", enabled: true },
  { letter: "G", enabled: true },
  { letter: "H", enabled: true },
  { letter: "J", enabled: true },
  { letter: "K", enabled: true },
  { letter: "L", enabled: true },
  { letter: "M", enabled: true },
  { letter: "N", enabled: true },
  { letter: "Ñ", enabled: true },
  { letter: "P", enabled: true },
  { letter: "Q", enabled: true },
  { letter: "R", enabled: true },
  { letter: "S", enabled: true },
  { letter: "T", enabled: true },
  { letter: "V", enabled: true },
  { letter: "W", enabled: true },
  { letter: "X", enabled: true },
  { letter: "Y", enabled: true },
  { letter: "Z", enabled: true },
];

const GamePage = () => {
  // Para almacenar la frase
  const [phrase, setphrase] = useState("La ruleta de la suerte");

  // Para almacenar la pista de la  frase
  const [clue, setclue] = useState("Esta es la pista de la frase");

  // Para activar o desactivar los botones de juego
  const [choose, setChoose] = useState(true);

  // Para saber si tiene comodin
  const [hasJocker, setHasJocker] = useState(true);

  // Para saber el gajo que ha salido en la ruleta
  const [wedgeResult, setWedgeResult] = useState(null);

  // Controlamos el modal que vamos a mostrar para la accion elegida en controlsGame
  const [actionMode, setActionMode] = useState(null);

  // Para almacenar las vocales que hay, activas o desactivas
  const [vowels, setVowels] = useState(initialVowels);

  // Para almacenar las  consonantes que hay, activas o desactivas
  const [consonants, setConsonants] = useState(initialConsonants);

  // Para almacenar la letra elegida
  const [selectedLetter, setSelectedLetter] = useState([]);

  // Función para cerrar el modal
  const closeActionMode = () => setActionMode(null);

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
      setChoose(true);
      if (action === "Comodin") {
        setHasJocker(true);
        setActionMode("joker");
      } else if (action === "Vocal") {
        setActionMode("vowel");
      } else if (action === "Consonante") {
        setActionMode("consonant");
      } else if (action === "Resolver") {
        setActionMode("solve");
      } else {
        setChoose(false);
      }
    }
  };

  const handleletterSelected = (letter, actionMode) => {
    setSelectedLetter([...selectedLetter, letter]);
    if (actionMode === "vowel") {
      setVowels((prev) =>
        prev.map((item) =>
          item.letter === letter ? { ...item, enabled: false } : item
        )
      );
    } else if (actionMode === "consonant") {
      setConsonants((prev) =>
        prev.map((item) =>
          item.letter === letter ? { ...item, enabled: false } : item
        )
      );
    }
  };

  return (
    <main className="gameMain">
      <Panel phrase={phrase} clue={clue} selectedLetter={selectedLetter} />
      <Markers wedgeResult={wedgeResult} />
      <Roulette
        spinEnd={spinEnd}
        actionMode={actionMode}
        vowels={vowels}
        consonants={consonants}
        handleletterSelected={handleletterSelected}
        closeActionMode={closeActionMode}
      />
      <ControlsGame
        choose={choose}
        hasJocker={hasJocker}
        updateControls={updateControls}
      />
    </main>
  );
};

export default GamePage;
