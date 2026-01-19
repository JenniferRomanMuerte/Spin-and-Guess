import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/layout/GameMain.scss";

import ControlsGame from "../../sectionsGame/ControlsGame";
import Markers from "../../sectionsGame/Markers";
import Panel from "../../sectionsGame/Panel";
import Roulette from "../../sectionsGame/Roulette";
import ActionModal from "../../sectionsGame/modal/ActionModal";
import Footer from "../../layout/Footer";
import StatsModal from "../../sectionsGame/modal/StatsModal";

import {
  isScoringWedge,
  pluralize,
  isPhraseExhausted,
  hasRemainingConsonantInPhrase,
  hasUsefulVowelsLeft,
} from "./utils/gameUtils";
import { useRoundInfoMessages } from "../../../hooks/useRoundInfoMessages";
import { initialVowels, initialConsonants } from "../../../data/letters";
import storage from "../../../services/localStorage";
import { getPhrase } from "../../../services/phrases.service";
import { markPhraseAsPlayed } from "../../../services/user-phrases.service";
import { saveGame } from "../../../services/game.service";

import useComputerTurn from "./hooks/useComputerTurn";
import usePlayerTurn from "./hooks/usePlayerTurn";
import useTurnManager from "./hooks/useTurnManager";
import useGameUI from "./hooks/useGameUI";
import useGameFlow from "./hooks/useGameFlow";
import useGameEnd from "./hooks/useGameEnd";

const GamePage = ({
  namePlayer,
  turn,
  changeTurn,
  changeNamePlayer,
  updateRoundInfo,
  clearRoundInfo,
}) => {
  const navigate = useNavigate();

  /******************************************************************
   * REFS (no provocan re-render)
   ******************************************************************/
  // Permite llamar a métodos del componente Roulette (spin)
  const rouletteRef = useRef(null);

  // Evita doble giro automático en desarrollo (StrictMode)
  const didComputerSpinRef = useRef(false);

  const turnTimeoutRef = useRef(null);

  const solvedPhraseIdRef = useRef(null);

  /******************************************************************
   * ESTADO DEL JUEGO (datos)
   ******************************************************************/
  // Frase, pista y categoria
  const [phraseId, setPhraseId] = useState(null);
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

  // Estado de los comodines
  const [jockerPlayerCount, setJockerPlayerCount] = useState(0);
  const [jockerComputerCount, setJockerComputerCount] = useState(0);

  // Resultado de resolver la frase (true / false / null)
  const [solveResult, setSolveResult] = useState(null);

  // Saber quien ha resuelto la frase
  const [solveBy, setSolveBy] = useState(null);

  // Congelar tablero
  const [roundEnded, setRoundEnded] = useState(false);

  // Estado para modales de ranking e historial
  const [statsModal, setStatsModal] = useState(null);

  /******************************************************************
   * OBTENER NUEVA FRASE (reutilizable)
   ******************************************************************/
  const fetchNewPhrase = async () => {
    const token = storage.get("token");
    if (!token) return;

    const response = await getPhrase(token);

    setPhraseId(response.phrase.id);
    setPhrase(response.phrase.phrase);
    setClue(response.phrase.clue);
    setCategory(response.phrase.category);
  };

  /******************************************************************
   * MENSAJES DE RONDA
   ******************************************************************/

  // Hook que gestiona cola de mensajes y temporizados
  const { show, showTemp, enqueue, resetQueue } =
    useRoundInfoMessages(updateRoundInfo);

  /******************************************************************
   * ESTADO DERIVADO / REGLAS
   ******************************************************************/
  const VOWEL_COST = 50;

  /******************************************************************
   * Regla UI:
   * Si se han seleccionado todas las vocales o consosonantes
   ******************************************************************/
  const hasAvailableVowels = vowels.some((v) => v.enabled);
  const hasAvailableConsonants = consonants.some((c) => c.enabled);

  /******************************************************************
   * Regla UI: el jugador solo puede comprar vocal si:
   * - No es turno de la computadora
   * - El gajo actual es puntuable
   * - Tiene puntos suficientes
   ******************************************************************/
  const canBuyVowel =
    turn !== "computer" &&
    isScoringWedge(currentWedge) &&
    playerScore >= VOWEL_COST &&
    hasAvailableVowels;

  /******************************************************************
   * FUERZA UN NUEVO GIRO DE RULETA
   * Usado cuando alguien acierta y sigue jugando
   ******************************************************************/
  const requestSpinAgain = () => {
    rouletteRef.current?.spin();
  };

  /******************************************************************
   * HOOK encargado de gestionar los turnos del juego
   * - cambio de turno inmediato
   * - cambio de turno con delay
   * - bloqueo de acciones durante la transición
   ******************************************************************/
  const {
    handoverToComputer,
    goToPlayerTurn,
    goToComputerTurn,
    goToComputerTurnAfter,
    cancelTurnTimeout,
  } = useTurnManager({
    changeTurn,
  });

  /******************************************************************
   * HOOK encargado de la UI del juego
   * - modales
   * - bloqueo de controles
   * - inicio de giro
   ******************************************************************/
  const {
    controlsDisabled,
    rouletteDisabled,
    modalMode,
    updateControlsGame,
    closeModal,
    startSpin,
    lockUI,
    enableSpinOnly,
    enableActions,
    setModalMode,
  } = useGameUI({
    resetQueue,
    cancelTurnTimeout,
    turn,
    handoverToComputer,
  });

  /******************************************************************
   * HOOK DE TURNO COMPUTER (IA)
   ******************************************************************/
  const onComputerSolve = (solved) => {
    solvedPhraseIdRef.current = phraseId;
    setSolveBy("computer");
    setSolveResult(solved);
    setModalMode({ type: "solve", solver: "computer" });
  };

  const { handleComputerSpinEnd } = useComputerTurn({
    phrase,
    computerScore,
    vowels,
    consonants,
    selectedLetters,
    jockerComputerCount,
    setComputerScore,
    setVowels,
    setConsonants,
    setSelectedLetters,
    setJockerComputerCount,
    enqueue,
    goToPlayerTurn,
    requestSpinAgain,
    VOWEL_COST,
    onComputerSolve,
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
      case "SCORING_WEDGE": {
        closeModal();
        show(
          `${
            wedge.action === "superPremio" ? "SUPERPREMIO!!! " : ""
          }Juegas por: ${wedge.value}`,
        );

        // Si no hay jugada útil, forzamos resolver
        const hasUsefulConsonants = hasRemainingConsonantInPhrase(
          consonants,
          phrase,
        );
        const hasUsefulVowels = hasUsefulVowelsLeft(vowels, phrase);
        const canBuyUsefulVowel = hasUsefulVowels && playerScore >= VOWEL_COST;

        if (!hasUsefulConsonants && !canBuyUsefulVowel) {
          showTemp(
            "⚠️ No tienes jugadas posibles. Debes resolver la frase.",
            2000,
          );
          setModalMode({ type: "solve", solver: "player" });
          return;
          
        }

        enableActions();
        break;
      }

      case "RISK_WEDGE":
        show("Has caído en un gajo misterioso… ❓");
        setModalMode({ type: "risk" });
        break;

      case "JOKER":
        show("Enhorabuena! Has conseguido un comodín, Tira de nuevo!");
        setJockerPlayerCount((prev) => prev + 1);
        enableSpinOnly();
        break;

      case "CONSONANT_HIT": {
        const { letter, hits, earned } = result;
        const timesText = pluralize(hits, "vez", "veces");
        closeModal();
        show(
          `La letra ${letter} aparece ${hits} ${timesText}. Ganas ${earned}. ¡Sigue jugando!`,
        );

        enableSpinOnly();
        break;
      }

      case "CONSONANT_MISS": {
        const ms = 2500;
        closeModal();
        showTemp(
          `La letra ${result.letter} no está en la frase 😬, pierdes el turno`,
          ms,
        );
        lockUI();
        goToComputerTurnAfter(ms);
        break;
      }

      case "VOWEL_HIT": {
        const { letter, hits } = result;
        const timesText = pluralize(hits, "vez", "veces");

        closeModal();
        show(`Compras ${letter}. Aparece ${hits} ${timesText}.`);
        enableSpinOnly();
        break;
      }

      case "VOWEL_MISS": {
        const ms = 2500;
        closeModal();
        showTemp(`Compras ${result.letter}… pero no está 😬`, ms);
        goToComputerTurnAfter(ms);
        break;
      }

      case "NOT_ENOUGH_MONEY":
        closeModal();
        showTemp("No tienes puntos suficientes 😬", 2000);
        enableActions();
        break;

      case "LOSE_TURN": {
        const ms = 2500;
        closeModal();
        showTemp("Lo siento, has perdido el turno", ms);
        goToComputerTurnAfter(ms);
        break;
      }

      case "INVALID_ACTION":
        closeModal();
        showTemp("Acción no válida en este momento 😬", 1500);
        enableSpinOnly();
        break;

      case "BANKRUPT": {
        // Si tiene comodín, preguntamos
        if (jockerPlayerCount > 0) {
          show("💥 Has caído en QUIEBRA");
          setModalMode({ type: "joker" });
          lockUI();
          return;
        }

        // Sin comodín → comportamiento normal
        const ms = 2500;
        setPlayerScore(0);
        showTemp("Ohhh, lo has perdido todo", ms);
        goToComputerTurnAfter(ms);
        break;
      }

      default:
        break;
    }
  };

  /******************************************************************
   * HOOK encargado de conectar:
   * - reglas
   * - UI
   * - turnos
   ******************************************************************/
  const { spinEnd, onLetterSelected, onSubmitSolve } = useGameFlow({
    turn,
    phrase,
    phraseId,
    currentWedge,
    solvedPhraseIdRef,

    handlePlayerSpinEnd,
    handleComputerSpinEnd,
    handleLetterSelected,
    handlePlayerResult,

    lockUI,
    setCurrentWedge,
    setSolveBy,
    setSolveResult,
  });

  /******************************************************************
   * RISK WEDGE: el jugador decide si arriesga o no
   ******************************************************************/
  const resolveRisk = (accept) => {
    closeModal();

    // El jugador decide NO arriesgar
    if (!accept) {
      show("Decides no arriesgar. Sigues jugando 🎛️");
      enableSpinOnly();
      return;
    }

    // Decide suerte o desgracia
    const lucky = Math.random() < 0.5;

    setPlayerScore((prev) => {
      const newScore = lucky ? prev * 2 : Math.floor(prev / 2);

      show(
        lucky
          ? `🍀 ¡Suerte! Tus puntos se duplican (${newScore})`
          : `💥 Mala suerte… tus puntos se dividen (${newScore})`,
      );

      return newScore;
    });

    enableSpinOnly();
  };

  /******************************************************************
   * JOKER: el jugador decide si usa el comodín o no
   ******************************************************************/
  const resolveJoker = (useJoker) => {
    closeModal();

    if (useJoker) {
      setJockerPlayerCount((prev) => Math.max(prev - 1, 0));

      show("Usas un comodín y te salvas de la quiebra, sigue jugando!");

      enableSpinOnly();
      return;
    }
    const ms = 2500;
    setPlayerScore(0);

    showTemp("💥 Aceptas la quiebra. Pierdes todos los puntos", ms);

    lockUI();
    goToComputerTurnAfter(ms);
  };

  /******************************************************************
   * Revela todas las letras de la frase en el panel
   ******************************************************************/
  const revealFullPhrase = () => {
    const letters = phrase
      .toLowerCase()
      .replace(/[^a-záéíóúüñ]/gi, "") // quitamos espacios y símbolos
      .split("");

    const uniqueLetters = [...new Set(letters)];

    setSelectedLetters(uniqueLetters);
  };

  /******************************************************************
   * FIN DE PARTIDA: decisiones del jugador
   ******************************************************************/
  const handleReplay = async () => {
    closeModal();

    // Marcamos la frase en la BBDD como jugada
    if (phraseId) {
      await markPhraseAsPlayed(phraseId);
    }
    setRoundEnded(false);
    resetRound();
    fetchNewPhrase();
  };

  const handleExitGame = async () => {
    closeModal();

    // Marcamos la frase en la BBDD como jugada
    if (phraseId) {
      await markPhraseAsPlayed(phraseId);
    }

    setRoundEnded(false);
    resetGame();
    navigate("/");
  };

  /******************************************************************
   * RESET DE RONDA
   * Se ejecuta se acierta el panel y el jugador decide seguir jugando
   ******************************************************************/
  const resetRound = () => {
    setPlayerScore(0);
    setComputerScore(0);

    setSelectedLetters([]);
    setCurrentWedge(null);
    setJockerPlayerCount(0);

    setVowels(initialVowels.map((v) => ({ ...v })));
    setConsonants(initialConsonants.map((c) => ({ ...c })));

    resetQueue();
    show("🎲 ¡Nueva ronda! Empiezas tú");

    setSolveResult(null);

    changeTurn("player");
  };

  /******************************************************************
   * RESET TOTAL DE PARTIDA
   * Se ejecuta cuando se acierta el panel y el jugador decide no seguir jugando
   ******************************************************************/
  const resetGame = () => {
    resetRound();
    changeNamePlayer("");
    clearRoundInfo("");
  };

  /******************************************************************
   * EFECTOS
   ******************************************************************/

  /******************************************************************
   *  Limpieza de timeouts al desmontar
   ******************************************************************/
  useEffect(() => {
    return () => {
      if (turnTimeoutRef.current) {
        clearTimeout(turnTimeoutRef.current);
      }
    };
  }, []);

  /******************************************************************
   * Obtener frase al iniciar partida
   ******************************************************************/
  useEffect(() => {
    fetchNewPhrase();
  }, []);

  /******************************************************************
   * Turno automático de la computer
   ******************************************************************/
  useEffect(() => {
    if (turn !== "computer") {
      didComputerSpinRef.current = false;
      return;
    }

    if (didComputerSpinRef.current) return;
    didComputerSpinRef.current = true;

    // Bloqueamos UI y cerramos cualquier modal
    lockUI();
    closeModal();

    rouletteRef.current?.spin();
    show("Turno de la computadora 🤖... girando la ruleta 🎛️");
  }, [turn, show]);

  /******************************************************************
   * Frase agotada: forzar resolución
   ******************************************************************/
  useEffect(() => {
    if (!phrase) return;

    if (!isPhraseExhausted(consonants, vowels, phrase)) return;

    // 🔹 CASO PLAYER
    if (turn === "player") {
      show("⚠️ No quedan letras posibles. Debes resolver la frase.");
      setModalMode({ type: "solve", solver: "player" });
      return;
    }

    // 🔹 CASO COMPUTER
    if (turn === "computer") {
      // No hacemos nada aquí:
      // la computer lo gestiona en useComputerTurn
      return;
    }
  }, [turn, consonants, vowels, phrase]);

  /******************************************************************
   * Resolución de intento de resolver la frase
   ******************************************************************/
  useGameEnd({
    solveResult,
    solveBy,

    phrase,
    phraseId: solvedPhraseIdRef.current,
    playerScore,

    revealFullPhrase,
    setRoundEnded,

    show,
    closeModal,

    saveGame,

    goToComputerTurn,
    cancelTurnTimeout,

    setSolveResult,
    setSolveBy,

    turnTimeoutRef,
  });

  // Funcion para cerra sesión
  const handleLogout = () => {
    storage.remove("token");
    storage.remove("user");

    changeNamePlayer("");
    setTurn("player");

    navigate("/");
  };

  /******************************************************************
   * RENDER
   ******************************************************************/
  return (
    <>
      <main className="gameMain">
        <Panel
          phrase={phrase}
          clue={clue}
          category={category}
          selectedLetters={selectedLetters}
          roundEnded={roundEnded}
        />

        <Markers
          namePlayer={namePlayer}
          playerScore={playerScore}
          computerScore={computerScore}
          jockerPlayerCount={jockerPlayerCount}
          jockerComputerCount={jockerComputerCount}
        />

        <article className="gameMain__rouletteArea">
          <Roulette
            ref={rouletteRef}
            rouletteDisabled={rouletteDisabled}
            spinEnd={spinEnd}
            startSpin={startSpin}
            blockUserSpin={turn === "computer" || handoverToComputer}
          />
        </article>

        <ControlsGame
          controlsDisabled={controlsDisabled}
          updateControlsGame={updateControlsGame}
          canBuyVowel={canBuyVowel}
          hasAvailableVowels={hasAvailableVowels}
          hasAvailableConsonants={hasAvailableConsonants}
        />
      </main>
      {modalMode && (
        <ActionModal
          modalMode={modalMode}
          vowels={vowels}
          consonants={consonants}
          handleletterSelected={onLetterSelected}
          onSubmitSolve={onSubmitSolve}
          solveResult={solveResult}
          resolveRisk={resolveRisk}
          onReplay={handleReplay}
          onExit={handleExitGame}
          jockerPlayerCount={jockerPlayerCount}
          resolveJoker={resolveJoker}
        />
      )}
      <Footer
        namePlayer={namePlayer}
        onLogout={handleLogout}
        onShowHistory={() => setStatsModal("history")}
        onShowRanking={() => setStatsModal("ranking")}
      />
      {statsModal && (
        <StatsModal type={statsModal} onClose={() => setStatsModal(null)} />
      )}
    </>
  );
};

export default GamePage;
