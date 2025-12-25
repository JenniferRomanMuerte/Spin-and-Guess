import { useState, useRef, useEffect } from "react";
import "../styles/layout/GameMain.scss";
import ControlsGame from "./sectionsGame/ControlsGame";
import Markers from "./sectionsGame/Markers";
import Panel from "./sectionsGame/Panel";
import Roulette from "./sectionsGame/Roulette";
import ActionModal from "./sectionsGame/Modal/ActionModal";
import { countLetterInPhrase } from "../utils/gameUtils";

import { initialVowels, initialConsonants } from "../data/letters";

const GamePage = ({ namePlayer, turn, changeTurn }) => {
  // Para almacenar la frase
  const [phrase, setPhrase] = useState("La ruleta de la suerte");

  // Para almacenar la pista de la  frase
  const [clue, setClue] = useState("Esta es la pista de la frase");

  // Puntucion del jugador
  const [playerScore, setPlayerScore] = useState(0);

  // Puntuacion de la computadora
  const [computerScore, setComputerScore] = useState(0);

  // Mensaje para RoundInfo
  const [messageRoundInfo, setMessageRoundInfo] = useState("");

  // Para activar o desactivar los botones de juego
  const [controlsDisabled, setControlsDisabled] = useState(true);

  // Para activar o desactivar el botón de girar la ruleta
  const [rouletteDisabled, setRouletteDisabled] = useState(false);

  // Para saber si tiene comodin
  const [hasJocker, setHasJocker] = useState(false);

  // Para saber el gajo que ha salido en la ruleta
  const [currentWedge, setCurrentWedge] = useState(null);

  // Controlamos el modal que vamos a mostrar para la accion elegida en controlsGame
  const [modalMode, setModalMode] = useState(null);

  // Para almacenar las vocales que hay, activas o desactivas
  const [vowels, setVowels] = useState(initialVowels);

  // Para almacenar las  consonantes que hay, activas o desactivas
  const [consonants, setConsonants] = useState(initialConsonants);

  // Para almacenar las letras elegida
  const [selectedLetters, setSelectedLetters] = useState([]);

  /*
  Para almacenar el nº que devuelve setTimeout).
  Asi no se actualiza con ningun render
  */
  const messageTimeoutRef = useRef(null);

  // Muestra un mensaje y lo borra automáticamente pasado X tiempo.
  const setMessageTemp = (text, ms = 3000) => {
    // Actualizamos el mensaje con el texto que recibimos
    setMessageRoundInfo(text);

    // Si ya había un timeout anterior programado, lo cancelamos.
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    // Creamos un  timeout y guardamos su ID en el ref.
    messageTimeoutRef.current = setTimeout(() => {
      // Borramos el mensaje pasados los ms
      setMessageRoundInfo("");

      //Limpiamos el ref para dejar claro que ya no hay timeout activo
      messageTimeoutRef.current = null;
    }, ms);
  };

  // Para limpiar el timeout si el componente se va de pantalla
  useEffect(() => {
    return () => {
      // Si había un timeout pendiente, lo cancelamos.
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  // Función para guardar el gajo y actualizar los estados de botones, ruleta y mensaje
  const spinEnd = (wedge) => {
    // Guardamos el gajo que ha salido
    setCurrentWedge(wedge);

    // Bloqueamos la ruleta
    setRouletteDisabled(true);

    // Deshabilitamos botones por seguridad
    setControlsDisabled(true);

    // Actualizamos mensaje y habilitamos botones dependiendo de la accion
    if (wedge.action === "sumar") {
      setMessageRoundInfo(`Juegas por ${wedge.value}`);
      setControlsDisabled(false);
    } else if (wedge.action === "superPremio") {
      setMessageRoundInfo(`SUPERPREMIO!!! Juegas por:  ${wedge.value}`);
      setControlsDisabled(false);
    } else if (wedge.action === "comodin") {
      setMessageRoundInfo("Enhorabuena! Has consegido un comodin");
      setControlsDisabled(false);
      setHasJocker(true);
    } else if (wedge.action === "pierdeTurno") {
      setMessageTemp("Lo siento, has perdido el turno", 3000);
      goToComputerTurn();
    } else if (wedge.action === "quiebra") {
      setMessageTemp("Ohhh, lo has perdido todo", 3000);
      setPlayerScore(0);
      goToComputerTurn();
    }
  };

  // Funcion para actualizar los botones y mostrar un mopdal u otro
  const updateControlsGame = ({ text }) => {
    // Deshabiltamos los botones
    setControlsDisabled(true);

    if (text === "Comodin") {
      setHasJocker(false);
      setModalMode("joker");
    } else if (text === "Vocal") {
      setModalMode("vowel");
    } else if (text === "Consonante") {
      setModalMode("consonant");
    } else if (text === "Resolver") {
      setModalMode("solve");
    }
  };

  // Funcion para actualizar las vocales o consonantes elegidas
  const handleletterSelected = (letter, modalMode) => {
    setSelectedLetters((prev) => [...prev, letter]);

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

    // Calculamos los puntos
    // Si la accion no es sumar o superPremio no hacemos nada
    if (
      !currentWedge ||
      (currentWedge.action !== "sumar" && currentWedge.action !== "superPremio")
    ) {
      return;
    }

    // Si no usamos la funcion para calcular cuantas letras hay de la elegida en la frase
    const hits = countLetterInPhrase(phrase, letter);

    if (hits > 0) {
      const earned = hits * currentWedge.value;

      setPlayerScore((prev) => prev + earned);

      setMessageRoundInfo(
        `La letra ${letter} aparece ${hits} vez/veces. Ganas ${earned} (${hits} × ${currentWedge.value}).`
      );
    } else {
      setMessageTemp(
        `La letra ${letter} no está en la frase 😬, pierdes el turno`,
        3000
      );
      goToComputerTurn();
    }
  };

  // Función para cerrar el modal, habilitar la ruleta, desactivar botones
  const closeModal = () => {
    setModalMode(null);
    setRouletteDisabled(false);
    setControlsDisabled(true);
  };

  // Funcion para resetear valores cuando vuelve as girar la ruleta:
  const startSpin = () => {
    setMessageRoundInfo("");
    setCurrentWedge(null);
  };

  // Funcion para pasar el truno a la computadora
  const goToComputerTurn = () => {
    changeTurn("computer");
    setControlsDisabled(true);
    setRouletteDisabled(true);
  };

  return (
    <main className="gameMain">
      <Panel phrase={phrase} clue={clue} selectedLetters={selectedLetters} />
      <Markers
        namePlayer={namePlayer}
        playerScore={playerScore}
        computerScore={computerScore}
        messageRoundInfo={messageRoundInfo}
      />
      <article className="gameMain__rouletteArea">
        <Roulette
          rouletteDisabled={rouletteDisabled}
          spinEnd={spinEnd}
          startSpin={startSpin}
        />
        {modalMode && (
          <ActionModal
            modalMode={modalMode}
            vowels={vowels}
            consonants={consonants}
            handleletterSelected={handleletterSelected}
            closeModal={closeModal}
          />
        )}
      </article>
      <ControlsGame
        controlsDisabled={controlsDisabled}
        hasJocker={hasJocker}
        updateControlsGame={updateControlsGame}
      />
    </main>
  );
};

export default GamePage;
