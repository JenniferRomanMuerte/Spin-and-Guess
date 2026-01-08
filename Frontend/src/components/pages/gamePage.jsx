import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/GameMain.scss";

import ControlsGame from "../sectionsGame/ControlsGame";
import Markers from "../sectionsGame/Markers";
import Panel from "../sectionsGame/Panel";
import Roulette from "../sectionsGame/Roulette";
import ActionModal from "../sectionsGame/modal/ActionModal";

import {
  countLetterInPhrase,
  isScoringWedge,
  getRandomEnabledLetter,
  pluralize,
} from "../../utils/gameUtils";
import { useRoundInfoMessages } from "../../hooks/useRoundInfoMessages";
import { initialVowels, initialConsonants } from "../../data/letters";
import storage from "../../services/localStorage";
import { getPhrase } from "../../services/phrases.service";

import useComputerTurn from "../../hooks/useComputerTurn";

const GamePage = ({ namePlayer, turn, changeTurn, changeNamePlayer }) => {
  const navigate = useNavigate();

  /******************************************************************
   * REFS (no provocan re-render)
   ******************************************************************/
  // Permite llamar a métodos del componente Roulette (spin)
  const rouletteRef = useRef(null);

  // Timeout para retrasar el cambio de turno (para que se vea el mensaje)
  const turnTimeoutRef = useRef(null);

  // Evita doble giro automático en desarrollo (StrictMode)
  const didComputerSpinRef = useRef(false);

  /******************************************************************
   * ESTADO DEL JUEGO (datos)
   ******************************************************************/
  // Frase, pista y categoria
  const [phrase, setPhrase] = useState("");
  const [clue, setClue] = useState("");
  const [category, setCategory] = useState("");

  // Marcadores
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  // Info en pantalla (RoundInfo)
  const [messageRoundInfo, setMessageRoundInfo] = useState("");

  // Hook de mensajes
  const { show, showTemp, enqueue, resetQueue } =
    useRoundInfoMessages(setMessageRoundInfo);

  const [handoverToComputer, setHandoverToComputer] = useState(false);

  // Letras disponibles (enabled true/false)
  const [vowels, setVowels] = useState(initialVowels);
  const [consonants, setConsonants] = useState(initialConsonants);

  // Letras ya elegidas (para pintar en Panel)
  const [selectedLetters, setSelectedLetters] = useState([]);

  // Último gajo que salió en la ruleta
  const [currentWedge, setCurrentWedge] = useState(null);

  // Si el jugador tiene comodín
  const [hasJocker, setHasJocker] = useState(false);

  // Para saber si ha acertado o fallado cuando resuelve
  const [solveResult, setSolveResult] = useState(null);

  // Valor de las vocales
  const VOWEL_COST = 50;

  // Para activar o desactivar el comprar vocales del jugador
  const canBuyVowel =
    turn !== "computer" &&
    isScoringWedge(currentWedge) &&
    playerScore >= VOWEL_COST;

  /******************************************************************
   * ESTADO DE UI (control de botones/modales)
   ******************************************************************/
  const [controlsDisabled, setControlsDisabled] = useState(true);
  const [rouletteDisabled, setRouletteDisabled] = useState(false);
  const [modalMode, setModalMode] = useState(null);

  /******************************************************************
   * HELPERS: timeouts / transición de turnos
   ******************************************************************/
  // Cancela el timeout pendiente de cambio de turno (si existe)
  const cancelTurnTimeout = () => {
    if (turnTimeoutRef.current) {
      clearTimeout(turnTimeoutRef.current);
      turnTimeoutRef.current = null;
    }
  };

  // Limpieza al desmontar (evita leaks)
  useEffect(() => {
    return cancelTurnTimeout;
  }, []);

  // Cambia al turno computer DESPUÉS de ms (para que el mensaje no se borre enseguida)
  const goToComputerTurnAfter = (ms) => {
    cancelTurnTimeout();

    //  Bloquea inmediatamente cualquier intento del jugador
    setHandoverToComputer(true);
    setRouletteDisabled(true);
    setControlsDisabled(true);
    setModalMode(null);

    turnTimeoutRef.current = setTimeout(() => {
      setHandoverToComputer(false);
      goToComputerTurn();
    }, ms);
  };


  /******************************************************************
   * CAMBIO DE TURNO: a computadora (inmediato)
   * (el delay lo controla goToComputerTurnAfter)
   ******************************************************************/
  const goToComputerTurn = () => {
    setHandoverToComputer(false);
    changeTurn("computer");
    setControlsDisabled(true);
    setRouletteDisabled(true);
  };

  /******************************************************************
   * CAMBIO DE TURNO: a jugador (inmediato)
   * (el delay lo controla goToPlayerTurnAfter)
   ******************************************************************/
  const goToPlayerTurn = () => {
    setHandoverToComputer(false);
    changeTurn("player");
    setControlsDisabled(true);
    setRouletteDisabled(false);
  };
  const requestSpinAgain = () => {
    rouletteRef.current?.spin();
  };

  const { handleComputerSpinEnd } = useComputerTurn({
    phrase,
    computerScore,
    vowels,
    consonants,
    setComputerScore,
    setVowels,
    setConsonants,
    setSelectedLetters,
    enqueue,
    goToPlayerTurn,
    requestSpinAgain,
    VOWEL_COST,
  });

  /******************************************************************
   * EFECTO: hacemos la petición para la frase
   ******************************************************************/

  useEffect(() => {
    const fetchPhrase = async () => {
      try {
        const token = storage.get("token");

        if (!token) {
          console.error("No hay token");
          return;
        }

        const response = await getPhrase(token);

        setPhrase(response.phrase.phrase);
        setClue(response.phrase.clue);
        setCategory(response.phrase.category);
      } catch (error) {
        console.error("Error obteniendo la frase:", error);
      }
    };

    fetchPhrase();
  }, []);

  /******************************************************************
   * EFECTO: cuando entra el turno de la computadora, gira solo
   ******************************************************************/
  useEffect(() => {
    // Si no es turno computer: resetea candado y sal
    if (turn !== "computer") {
      didComputerSpinRef.current = false;
      return;
    }

    // StrictMode: evita doble ejecución
    if (didComputerSpinRef.current) return;
    didComputerSpinRef.current = true;

    // Seguridad UI
    setControlsDisabled(true);
    setModalMode(null);

    // Gira la ruleta automáticamente
    rouletteRef.current?.spin();

    // Mensaje (lo pones después porque startSpin limpia)
    show("Turno de la computadora 🤖... girando la ruleta 🎛️");
  }, [turn, show]);

  /******************************************************************
   * EFECTO: cuando acierta o falla la resolucion del panel
   ******************************************************************/
  useEffect(() => {
    // Mientras esté null, todavía estamos en el input (no hacemos nada)
    if (solveResult === null) return;

    // Cancelamos cualquier timeout anterior (por si acaso)
    cancelTurnTimeout();

    if (solveResult === true) {
      // GANA: mostrar modal 5s y luego reset + ir a Inicio
      turnTimeoutRef.current = setTimeout(() => {
        resetGame();
        navigate("/");
      }, 3000);

      return;
    }

    if (solveResult === false) {
      // FALLA: mostrar modal 3s y luego pasar turno a computer
      turnTimeoutRef.current = setTimeout(() => {
        setModalMode(null); // cerramos  modal
        setSolveResult(null); // reseteamos para la proxima
        goToComputerTurn(); // cambiamos turno a computer
      }, 2000);
    }
  }, [solveResult]);

  /******************************************************************
   * CALLBACK: la ruleta terminó de girar
   * (cosas comunes + delega a jugador o computer)
   ******************************************************************/
  const spinEnd = (wedge) => {
    // Cosas comunes (siempre)
    setCurrentWedge(wedge);
    setRouletteDisabled(true);
    setControlsDisabled(true);

    // Delegamos según turno
    if (turn === "computer") handleComputerSpinEnd(wedge);
    else handlePlayerSpinEnd(wedge);
  };

  /******************************************************************
   * LÓGICA TURNO JUGADOR: qué pasa según el gajo
   ******************************************************************/
  const handlePlayerSpinEnd = (wedge) => {
    if (isScoringWedge(wedge)) {
      const label = wedge.action === "superPremio" ? "SUPERPREMIO!!! " : "";
      show(`${label}Juegas por: ${wedge.value}`);
      setControlsDisabled(false);
      return;
    }

    if (wedge.action === "comodin") {
      show("Enhorabuena! Has conseguido un comodín");
      setHasJocker(true);
      setControlsDisabled(false);
      return;
    }

    // IMPORTANTE: el ms del mensaje y el ms del cambio de turno deben ser el MISMO
    if (wedge.action === "pierdeTurno") {
      const ms = 2500;
      showTemp("Lo siento, has perdido el turno", ms);
      goToComputerTurnAfter(ms);
      return;
    }
    if (wedge.action === "quiebra") {
      const ms = 2500;
      showTemp("Ohhh, lo has perdido todo", ms);
      setPlayerScore(0);
      goToComputerTurnAfter(ms);
      return;
    }
  };

  /******************************************************************
   * UI: botones de ControlsGame -> abre modal correspondiente
   ******************************************************************/
  const updateControlsGame = ({ text }) => {
    setControlsDisabled(true);

    if (text === "Comodin") {
      setHasJocker(false);
      setModalMode("joker");
      return;
    }
    if (text === "Comprar Vocal") {
      setModalMode("vowel");
      return;
    }
    if (text === "Consonante") {
      setModalMode("consonant");
      return;
    }
    if (text === "Resolver") {
      setModalMode("solve");
      return;
    }
  };

  /******************************************************************
   * JUGADOR ELIGE LETRA (desde ActionModal)
   * Dispatcher: guarda la letra (para Panel) y delega según la accion elegida
   ******************************************************************/
  const handleLetterSelected = (letter, mode) => {
    // Siempre: guardar para pintar en el Panel
    setSelectedLetters((prev) => [...prev, letter]);

    if (mode === "vowel") return handlePlayerVowel(letter);
    if (mode === "consonant") return handlePlayerConsonant(letter);
  };

  /******************************************************************
   * JUGADOR COMPRA VOCAL
   * Reglas:
   * - cuesta VOWEL_COST (precio fijo, NO depende de apariciones)
   * - si no tiene puntos suficientes, se cancela
   * - si la vocal NO está en la frase, pierde el turno (delay + pasa a computer)
   * - si está, muestra las voicales en el panel, informa y sigue tirando
   ******************************************************************/
  const handlePlayerVowel = (letter) => {
    // Desactiva vocal elegida
    setVowels((prev) =>
      prev.map((item) =>
        item.letter === letter ? { ...item, enabled: false } : item
      )
    );

    // Seguridad (aunque el botón ya esté bloqueado)
    if (playerScore < VOWEL_COST) {
      showTemp(
        `Necesitas ${VOWEL_COST} puntos para comprar una vocal 😬`,
        2000
      );
      return;
    }

    // Pagas la vocal (precio fijo, NO por apariciones)
    setPlayerScore((prev) => prev - VOWEL_COST);

    const hits = countLetterInPhrase(phrase, letter);
    const timesText = pluralize(hits, "vez", "veces");

    if (hits > 0) {
      show(
        `Compras ${letter} por ${VOWEL_COST}. Aparece ${hits} ${timesText}.`
      );
      return;
    }

    // Si no está, pierde turno
    const ms = 2500;
    showTemp(`Compras ${letter} por ${VOWEL_COST}… pero no está 😬`, ms);
    goToComputerTurnAfter(ms);
  };

  /******************************************************************
   * JUGADOR ELIGE CONSONANTE
   * Reglas:
   * - solo se permite si el gajo actual es de puntos (sumar / superPremio)
   * - si acierta: suma earned = hits * currentWedge.value y sigue jugando
   * - si falla: pierde turno (delay + pasa a computer)
   ******************************************************************/

  const handlePlayerConsonant = (letter) => {
    // Desactiva consonante elegida
    setConsonants((prev) =>
      prev.map((item) =>
        item.letter === letter ? { ...item, enabled: false } : item
      )
    );

    // Si el gajo actual no suma puntos, no se puede jugar consonante
    if (!isScoringWedge(currentWedge)) return;

    const hits = countLetterInPhrase(phrase, letter);
    const timesText = pluralize(hits, "vez", "veces");

    if (hits > 0) {
      const earned = hits * currentWedge.value;
      setPlayerScore((prev) => prev + earned);

      show(
        `La letra ${letter} aparece ${hits} ${timesText}. Ganas ${earned}. ¡Sigue jugando!`
      );

      // Si acierta, sigue jugando
      setRouletteDisabled(false);
      setControlsDisabled(true);
      return;
    }

    const ms = 2500;
    showTemp(`La letra ${letter} no está en la frase 😬, pierdes el turno`, ms);
    goToComputerTurnAfter(ms);
  };

  /******************************************************************
   * MODAL: cerrar (vuelve a permitir girar)
   ******************************************************************/
  const closeModal = () => {
    setModalMode(null);
    setControlsDisabled(true);

    // Solo re-habilita si NO estamos entregando turno y NO es la compu
    if (turn !== "computer" && !handoverToComputer) {
      setRouletteDisabled(false);
    }
  };

  /******************************************************************
   * CUANDO EMPIEZA UN GIRO (desde Roulette)
   * - cancela auto-clear del mensaje
   * - limpia el texto
   * - resetea el gajo actual
   ******************************************************************/
  const startSpin = () => {
    cancelTurnTimeout(); // corta cambios de turno pendientes (goToComputerTurnAfter)

    setRouletteDisabled(true);
    setControlsDisabled(true);
    setModalMode(null);

    resetQueue();
    setCurrentWedge(null);
  };



  /******************************************************************
   * COMPROBAMOS SI LA FRASE DEL PLAYER COINCIDICE CON LA FRASE A ADIVINAR
   ******************************************************************/
  const onSubmitSolve = (phrasePlayer) => {
    setSolveResult(null);
    setSolveResult(phrasePlayer.toLowerCase() === phrase.toLowerCase());
  };

  /******************************************************************
   * RESETEO cuando gana la partida
   ******************************************************************/
  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setSelectedLetters([]);
    setCurrentWedge(null);
    setHasJocker(false);

    setVowels(initialVowels.map((vowel) => ({ ...vowel })));
    setConsonants(initialConsonants.map((consonant) => ({ ...consonant })));

    setModalMode(null);
    setSolveResult(null);

    setControlsDisabled(true);
    setRouletteDisabled(false);
    setHandoverToComputer(false);

    changeNamePlayer("");

    changeTurn("player");
  };

  /******************************************************************
   * RENDER
   ******************************************************************/
  return (
    <main className="gameMain">
      <Panel
        phrase={phrase}
        clue={clue}
        category={category}
        selectedLetters={selectedLetters}
      />

      <Markers
        namePlayer={namePlayer}
        playerScore={playerScore}
        computerScore={computerScore}
        messageRoundInfo={messageRoundInfo}
      />

      <article className="gameMain__rouletteArea">
        <Roulette
          ref={rouletteRef}
          rouletteDisabled={rouletteDisabled}
          spinEnd={spinEnd}
          startSpin={startSpin}
          blockUserSpin={turn === "computer" || handoverToComputer}
        />

        {modalMode && (
          <ActionModal
            modalMode={modalMode}
            vowels={vowels}
            consonants={consonants}
            handleletterSelected={handleLetterSelected}
            closeModal={closeModal}
            onSubmitSolve={onSubmitSolve}
            solveResult={solveResult}
          />
        )}
      </article>

      <ControlsGame
        controlsDisabled={controlsDisabled}
        hasJocker={hasJocker}
        updateControlsGame={updateControlsGame}
        canBuyVowel={canBuyVowel}
      />
    </main>
  );
};

export default GamePage;
