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

  // Puntucion del jugador
  const [playerScore, setPlayerScore] = useState(null);

  // Puntuacion de la computadora
  const [computerScore, setComputerScore] = useState(null);

  // Mensaje para RoundInfo
  const [messageRoundInfo, setMessageRoundInfo] = useState("");

  // Para activar o desactivar los botones de juego
  const [controlsDisabled, setcontrolsDisabled] = useState(true);

  // Para saber si tiene comodin
  const [hasJocker, setHasJocker] = useState(true);

  // Para saber el gajo que ha salido en la ruleta
  const [currentWedge, setcurrentWedge] = useState(null);

  // Controlamos el modal que vamos a mostrar para la accion elegida en controlsGame
  const [modalMode, setmodalMode] = useState(null);

  // Para almacenar las vocales que hay, activas o desactivas
  const [vowels, setVowels] = useState(initialVowels);

  // Para almacenar las  consonantes que hay, activas o desactivas
  const [consonants, setConsonants] = useState(initialConsonants);

  // Para almacenar las letras elegida
  const [selectedLetters, setselectedLetters] = useState([]);

  // Función para cerrar el modal
  const closemodalMode = () => setmodalMode(null);

  // Función para guardar el gajo y actualizar los estados de botones y mensaje
  const spinEnd = (wedge) => {
    setcurrentWedge(wedge);
    updateControls({ source: "roulette", action: wedge.action });

    if (wedge.action === "sumar") {
      setMessageRoundInfo(`Juegas por ${wedge.value}`);
    } else if (wedge.action === "superPremio") {
      setMessageRoundInfo(`SUPERPREMIO!!! Juegas por:  ${wedge.value}`);
    } else if (wedge.action === "pierdeTurno") {
      setMessageRoundInfo("Lo siento has perdido el turno");
    } else if (wedge.action === "quiebra") {
      setMessageRoundInfo("Ohhh, lo has perdido todo");
      setPlayerScore(0);
    } else if (wedge.action === "comodin") {
      setMessageRoundInfo("Enhorabuena! Has consegido un comodin");
    }
  };

  // Funcion para actualizar los estados de los controles
  const updateControls = ({ source, action }) => {
    if (source === "roulette") {
      setHasJocker(action !== "comodin"); // solo true si ha salido COMODIN
      if (action === "pierdeTurno" || action === "quiebra") {
        return;
      } else {
        setcontrolsDisabled(false);
      }
      return;
    }

    if (source === "button") {
      setcontrolsDisabled(true);
      if (action === "Comodin") {
        setHasJocker(true);
        setmodalMode("joker");
      } else if (action === "Vocal") {
        setmodalMode("vowel");
      } else if (action === "Consonante") {
        setmodalMode("consonant");
      } else if (action === "Resolver") {
        setmodalMode("solve");
      } else {
        setcontrolsDisabled(false);
      }
    }
  };

  // Funcion para actualizar las vocales o consonantes elegidas
  const handleletterSelected = (letter, modalMode) => {
    setselectedLetters([...selectedLetters, letter]);
    if (modalMode === "vowel") {
      setVowels((prev) =>
        prev.map((item) =>
          item.letter === letter ? { ...item, enabled: false } : item
        )
      );
    } else if (modalMode === "consonant") {
      setConsonants((prev) =>
        prev.map((item) =>
          item.letter === letter ? { ...item, enabled: false } : item
        )
      );
    }
  };

  return (
    <main className="gameMain">
      <Panel phrase={phrase} clue={clue} selectedLetters={selectedLetters} />
      <Markers
        playerScore={playerScore}
        computerScore={computerScore}
        messageRoundInfo={messageRoundInfo}
      />
      
      <Roulette
        spinEnd={spinEnd}
        modalMode={modalMode}
        vowels={vowels}
        consonants={consonants}
        handleletterSelected={handleletterSelected}
        closemodalMode={closemodalMode}
      />
      <ControlsGame
        controlsDisabled={controlsDisabled}
        hasJocker={hasJocker}
        updateControls={updateControls}
      />
    </main>
  );
};

export default GamePage;
