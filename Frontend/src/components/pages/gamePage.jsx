import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/GameMain.scss";

import ControlsGame from "../sectionsGame/ControlsGame";
import Markers from "../sectionsGame/Markers";
import Panel from "../sectionsGame/Panel";
import Roulette from "../sectionsGame/Roulette";
import ActionModal from "../sectionsGame/modal/ActionModal";

import { isScoringWedge, pluralize } from "../../utils/gameUtils";
import { useRoundInfoMessages } from "../../hooks/useRoundInfoMessages";
import { initialVowels, initialConsonants } from "../../data/letters";
import storage from "../../services/localStorage";
import { getPhrase } from "../../services/phrases.service";

import useComputerTurn from "../../hooks/useComputerTurn";
import usePlayerTurn from "../../hooks/usePlayerTurn";

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

  // Letras disponibles
  const [vowels, setVowels] = useState(initialVowels);
  const [consonants, setConsonants] = useState(initialConsonants);

  // Letras ya usadas (para mostrar en el panel)
  const [selectedLetters, setSelectedLetters] = useState([]);

  // Último gajo obtenido al girar la ruleta
  const [currentWedge, setCurrentWedge] = useState(null);

  // Estado del comodín
  const [hasJoker, setHasJocker] = useState(false);

  // Resultado de resolver la frase (true / false / null)
  const [solveResult, setSolveResult] = useState(null);

  /******************************************************************
   * MENSAJES DE RONDA
   ******************************************************************/
  const [messageRoundInfo, setMessageRoundInfo] = useState("");

  // Hook que gestiona cola de mensajes y temporizados
  const { show, showTemp, enqueue, resetQueue } =
    useRoundInfoMessages(setMessageRoundInfo);

  /******************************************************************
   * ESTADO DE UI (control de botones/modales)
   ******************************************************************/
  const [controlsDisabled, setControlsDisabled] = useState(true);
  const [rouletteDisabled, setRouletteDisabled] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [handoverToComputer, setHandoverToComputer] = useState(false);

  /******************************************************************
   * ESTADO DERIVADO / REGLAS
   ******************************************************************/
  const VOWEL_COST = 50;

  /******************************************************************
   * Regla UI: el jugador solo puede comprar vocal si:
   * - No es turno de la computadora
   * - El gajo actual es puntuable
   * - Tiene puntos suficientes
   ******************************************************************/
  const canBuyVowel =
    turn !== "computer" &&
    isScoringWedge(currentWedge) &&
    playerScore >= VOWEL_COST;

  /******************************************************************
   * TURN HELPERS
   ******************************************************************/
  // Cancela cualquier cambio de turno pendiente
  const cancelTurnTimeout = () => {
    if (turnTimeoutRef.current) {
      clearTimeout(turnTimeoutRef.current);
      turnTimeoutRef.current = null;
    }
  };

  /******************************************************************
   * CAMBIO DE TURNO A COMPUTER (inmediato)
   ******************************************************************/
  const goToComputerTurn = () => {
    setHandoverToComputer(false);
    changeTurn("computer");
    setControlsDisabled(true);
    setRouletteDisabled(true);
  };

  /******************************************************************
   * CAMBIO DE TURNO A PLAYER (inmediato)
   ******************************************************************/
  const goToPlayerTurn = () => {
    setHandoverToComputer(false);
    changeTurn("player");
    setControlsDisabled(true);
    setRouletteDisabled(false);
  };

  /******************************************************************
   * CAMBIO DE TURNO A COMPUTER CON DELAY
   * Se usa cuando hay mensaje que debe leerse antes
   ******************************************************************/
  const goToComputerTurnAfter = (ms) => {
    cancelTurnTimeout();

    setHandoverToComputer(true);
    setControlsDisabled(true);
    setRouletteDisabled(true);
    setModalMode(null);

    turnTimeoutRef.current = setTimeout(() => {
      setHandoverToComputer(false);
      goToComputerTurn();
    }, ms);
  };

  /******************************************************************
   * FUERZA UN NUEVO GIRO DE RULETA
   * Usado cuando alguien acierta y sigue jugando
   ******************************************************************/
  const requestSpinAgain = () => {
    rouletteRef.current?.spin();
  };

  /******************************************************************
   * HOOK DE TURNO COMPUTER (IA)
   ******************************************************************/
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
   * HOOK DE TURNO PLAYER (reglas puras)
   ******************************************************************/
  const { handlePlayerSpinEnd, handleLetterSelected } = usePlayerTurn({
    phrase,
    playerScore,
    currentWedge,
    setPlayerScore,
    setVowels,
    setConsonants,
    setSelectedLetters,
    VOWEL_COST,
  });

  /******************************************************************
   * PLAYER TURN RESULT INTERPRETER
   * Traduce reglas puras a:
   * - mensajes
   * - UI
   * - cambios de turno
   ******************************************************************/
  const handlePlayerResult = (result, wedge) => {
    switch (result.type) {
      case "SCORING_WEDGE":
        show(
          `${
            wedge.action === "superPremio" ? "SUPERPREMIO!!! " : ""
          }Juegas por: ${wedge.value}`
        );
        setControlsDisabled(false);
        break;

      case "JOKER":
        show("Enhorabuena! Has conseguido un comodín");
        setHasJocker(true);
        setControlsDisabled(false);
        break;

      case "CONSONANT_HIT": {
        const { letter, hits, earned } = result;
        const timesText = pluralize(hits, "vez", "veces");

        show(
          `La letra ${letter} aparece ${hits} ${timesText}. Ganas ${earned}. ¡Sigue jugando!`
        );

        setControlsDisabled(true);
        setRouletteDisabled(false);
        break;
      }

      case "CONSONANT_MISS": {
        const ms = 2500;
        showTemp(
          `La letra ${result.letter} no está en la frase 😬, pierdes el turno`,
          ms
        );
        goToComputerTurnAfter(ms);
        break;
      }

      case "VOWEL_HIT": {
        const { letter, hits } = result;
        const timesText = pluralize(hits, "vez", "veces");

        show(`Compras ${letter}. Aparece ${hits} ${timesText}.`);
        break;
      }

      case "VOWEL_MISS": {
        const ms = 2500;
        showTemp(`Compras ${result.letter}… pero no está 😬`, ms);
        goToComputerTurnAfter(ms);
        break;
      }

      case "NOT_ENOUGH_MONEY":
        showTemp("No tienes puntos suficientes 😬", 2000);
        break;

      case "LOSE_TURN": {
        const ms = 2500;
        showTemp("Lo siento, has perdido el turno", ms);
        goToComputerTurnAfter(ms);
        break;
      }

      case "BANKRUPT": {
        const ms = 2500;
        showTemp("Ohhh, lo has perdido todo", ms);
        goToComputerTurnAfter(ms);
        break;
      }

      default:
        break;
    }
  };

  /******************************************************************
   * CALLBACK: el jugador elige una letra desde el modal
   ******************************************************************/
  const onLetterSelected = (letter, mode) => {
    const result = handleLetterSelected(letter, mode);
    handlePlayerResult(result, currentWedge);
  };

  /******************************************************************
   * CALLBACK: la ruleta termina de girar
   * Punto central del flujo del juego:
   * - decide si actúa la IA o el jugador
   ******************************************************************/
  const spinEnd = (wedge) => {
    setCurrentWedge(wedge);
    setRouletteDisabled(true);
    setControlsDisabled(true);

    if (turn === "computer") {
      handleComputerSpinEnd(wedge);
      return;
    }

    const result = handlePlayerSpinEnd(wedge);

    handlePlayerResult(result, wedge);
  };

  /******************************************************************
   * UI CALLBACKS
   * Funciones que responden a acciones del usuario en la interfaz:
   * - botones
   * - modales
   * - inicio de giro
   * - resolución de la frase
   ******************************************************************/

  /******************************************************************
   * UI: botones de ControlsGame
   * Decide qué modal se abre según la acción elegida por el jugador
   ******************************************************************/
  const updateControlsGame = ({ text }) => {
    // Al pulsar cualquier botón, bloqueamos controles
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
   * MODAL: cerrar
   * - Cierra el modal activo
   * - Decide si el jugador puede volver a girar la ruleta
   ******************************************************************/
  const closeModal = () => {
    setModalMode(null);
    setControlsDisabled(true);

    // Solo permitimos girar si:
    // - no es turno de la computer
    // - no estamos en transición de turno
    if (turn !== "computer" && !handoverToComputer) {
      setRouletteDisabled(false);
    }
  };

  /******************************************************************
   * CALLBACK: inicio de giro de ruleta
   * Se ejecuta justo cuando la ruleta empieza a girar
   ******************************************************************/
  const startSpin = () => {
    // Cancelamos cualquier cambio de turno pendiente
    cancelTurnTimeout();

    // Bloqueamos toda interacción durante el giro
    setRouletteDisabled(true);
    setControlsDisabled(true);
    setModalMode(null);

    // Limpiamos mensajes y gajo anterior
    resetQueue();
    setCurrentWedge(null);
  };

  /******************************************************************
   * CALLBACK: el jugador intenta resolver la frase completa
   * Compara la frase introducida con la frase real
   ******************************************************************/
  const onSubmitSolve = (phrasePlayer) => {
    setSolveResult(null);

    // Normalizamos ambas frases para evitar falsos negativos
    setSolveResult(phrasePlayer.toLowerCase() === phrase.toLowerCase());
  };

  /******************************************************************
   * RESET TOTAL DE PARTIDA
   * Se ejecuta cuando el jugador gana la partida
   ******************************************************************/
  const resetGame = () => {
    // Marcadores
    setPlayerScore(0);
    setComputerScore(0);

    // Letras y estado del tablero
    setSelectedLetters([]);
    setCurrentWedge(null);
    setHasJocker(false);

    // Reset de pools de letras
    setVowels(initialVowels.map((v) => ({ ...v })));
    setConsonants(initialConsonants.map((c) => ({ ...c })));

    // UI
    setModalMode(null);
    setSolveResult(null);
    setControlsDisabled(true);
    setRouletteDisabled(false);
    setHandoverToComputer(false);

    // Sesión
    changeNamePlayer("");
    changeTurn("player");
  };

  /******************************************************************
   * EFECTOS
   ******************************************************************/

  // Limpieza de timeouts al desmontar
  useEffect(() => {
    return cancelTurnTimeout;
  }, []);

  // Obtener frase al iniciar partida
  useEffect(() => {
    const fetchPhrase = async () => {
      const token = storage.get("token");
      if (!token) return;

      const response = await getPhrase(token);
      setPhrase(response.phrase.phrase);
      setClue(response.phrase.clue);
      setCategory(response.phrase.category);
    };

    fetchPhrase();
  }, []);

  // Turno automático de la computer
  useEffect(() => {
    if (turn !== "computer") {
      didComputerSpinRef.current = false;
      return;
    }

    if (didComputerSpinRef.current) return;
    didComputerSpinRef.current = true;

    setControlsDisabled(true);
    setModalMode(null);

    rouletteRef.current?.spin();
    show("Turno de la computadora 🤖... girando la ruleta 🎛️");
  }, [turn, show]);

  // Resolución de intento de resolver la frase
  useEffect(() => {
    if (solveResult === null) return;

    cancelTurnTimeout();

    if (solveResult === true) {
      turnTimeoutRef.current = setTimeout(() => {
        resetGame();
        navigate("/");
      }, 3000);
      return;
    }

    if (solveResult === false) {
      turnTimeoutRef.current = setTimeout(() => {
        setModalMode(null);
        setSolveResult(null);
        goToComputerTurn();
      }, 2000);
    }
  }, [solveResult]);

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
            handleletterSelected={onLetterSelected}
            closeModal={closeModal}
            onSubmitSolve={onSubmitSolve}
            solveResult={solveResult}
          />
        )}
      </article>

      <ControlsGame
        controlsDisabled={controlsDisabled}
        hasJoker={hasJoker}
        updateControlsGame={updateControlsGame}
        canBuyVowel={canBuyVowel}
      />
    </main>
  );
};

export default GamePage;
