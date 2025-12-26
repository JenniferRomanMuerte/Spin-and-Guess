import { useState, useRef, useEffect } from "react";
import "../styles/layout/GameMain.scss";

import ControlsGame from "./sectionsGame/ControlsGame";
import Markers from "./sectionsGame/Markers";
import Panel from "./sectionsGame/Panel";
import Roulette from "./sectionsGame/Roulette";
import ActionModal from "./sectionsGame/Modal/ActionModal";

import {
  countLetterInPhrase,
  isScoringWedge,
  getRandomEnabledLetter,
  pluralize,
} from "../utils/gameUtils";
import { useRoundInfoMessages } from "../hooks/useRoundInfoMessages";
import { initialVowels, initialConsonants } from "../data/letters";

const GamePage = ({ namePlayer, turn, changeTurn }) => {
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
  // Frase y pista (luego vendrán de API o de un generador)
  const [phrase] = useState("La ruleta de la suerte");
  const [clue] = useState("Esta es la pista de la frase");

  // Marcadores
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  // Info en pantalla (RoundInfo)
  const [messageRoundInfo, setMessageRoundInfo] = useState("");

  // Hook de mensajes
  const { show, showTemp, enqueue, clear, resetQueue, cancelTimeout } =
    useRoundInfoMessages(setMessageRoundInfo);

  // Letras disponibles (enabled true/false)
  const [vowels, setVowels] = useState(initialVowels);
  const [consonants, setConsonants] = useState(initialConsonants);

  // Letras ya elegidas (para pintar en Panel)
  const [selectedLetters, setSelectedLetters] = useState([]);

  // Último gajo que salió en la ruleta
  const [currentWedge, setCurrentWedge] = useState(null);

  // Si el jugador tiene comodín
  const [hasJocker, setHasJocker] = useState(false);

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
    turnTimeoutRef.current = setTimeout(() => {
      goToComputerTurn();
    }, ms);
  };

  // Cambia al turno a jugador DESPUÉS de ms (para que el mensaje no se borre enseguida)
  const goToPlayerTurnAfter = (ms) => {
    cancelTurnTimeout();
    turnTimeoutRef.current = setTimeout(() => {
      goToPlayerTurn();
    }, ms);
  };
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
   * CALLBACK: la ruleta terminó de girar
   * (cosas comunes + delega a jugador o computer)
   ******************************************************************/
  const spinEnd = (wedge) => {
    console.log("[spinEnd winner]", wedge);
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
   * LÓGICA TURNO COMPUTER
   ******************************************************************/
  const handleComputerSpinEnd = async (wedge) => {
    // Si no es gajo de puntos: solo informamos
    if (!isScoringWedge(wedge)) {
      // Quiebra: resetea puntuación de la compu y pasa turno
      if (wedge.action === "quiebra") {
        setComputerScore(0);
        await enqueue(
          "¡QUIEBRA! La computadora pierde todos sus puntos 💸, TE TOCA!",
          2000
        );
        goToPlayerTurn();
        return;
      }

      // Pierde turno: pasa turno directamente
      if (wedge.action === "pierdeTurno") {
        await enqueue("La computadora pierde el turno. TE TOCA!", 2000);
        goToPlayerTurn();
        return;
      }

      // Comodín: por ahora solo lo anunciamos (luego decides si lo guarda)
      if (wedge.action === "comodin") {
        await enqueue("La computadora consigue un comodín 🎟️", 2000);

        await enqueue("La computadora vuelve a tirar…", 1000);
        rouletteRef.current?.spin();

        return;
      }

      // Cualquier otra acción no contemplada
      goToPlayerTurn();
      return;
    }

    // GAJO DE PUNTOS
    // Informamos del gajo (y esperamos)
    await enqueue(`La computadora juega por: ${wedge.value}`, 2000);

    // Decide si compra vocal
    // Obtenemos cuantas vocales y cuantas consonantes quedan disponibles
    const enabledVowelsCount = vowels.filter((v) => v.enabled).length;
    const enabledConsonantsCount = consonants.filter((c) => c.enabled).length;

    // Ibtenemos un nº aleatorio entre 0 y 1
    const roll = Math.random();

    /*
    Si la computadora tiene puntos,
    hay vocales disponibles,
    tiene más puntos que 300
    o hay menos de 5 consonantes disponibles
    o la probabilidad es menor de 0.25
    entonces es true ( eligirá vocal)
    */
    const shouldBuyVowel =
      computerScore >= VOWEL_COST &&
      enabledVowelsCount > 0 &&
      (computerScore >= 300 || enabledConsonantsCount <= 5 || roll < 0.25);

    if (shouldBuyVowel) {
      await enqueue(
        `La computadora decide comprar una vocal por ${VOWEL_COST}...`,
        1500
      );

      // Paga
      setComputerScore((prev) => prev - VOWEL_COST);

      const letter = computerChooseRandomVowel();

      if (!letter) {
        await enqueue("Ups, no quedan vocales disponibles 😵", 2000);
        goToPlayerTurn();
        return;
      }

      const hits = countLetterInPhrase(phrase, letter);
      const timesText = pluralize(hits, "vez", "veces");

      if (hits > 0) {
        await enqueue(
          `La computadora compra ${letter}. Aparece ${hits} ${timesText}.`,
          2500
        );

        await enqueue("✅ Acierta y sigue jugando 🎛️", 1200);
        rouletteRef.current?.spin();
        return;
      }

      await enqueue(`La computadora compra ${letter}… pero no está 😬`, 2500);
      await enqueue("Te toca a ti 👇", 1200);
      goToPlayerTurn();
      return;
    }

    // Si no compra vocal elige consonante
    const letter = computerChooseRandomConsonant();

    if (!letter) {
      await enqueue(
        "La computadora no tiene consonantes disponibles 😵, TE TOCA!",
        2000
      );
      goToPlayerTurn();
      return;
    }

    const hits = countLetterInPhrase(phrase, letter);

    const ms = 2500;

    if (hits > 0) {
      const earned = hits * wedge.value;
      setComputerScore((prev) => prev + earned);

      const timesText = pluralize(hits, "vez", "veces");

      await enqueue(
        `La computadora elige ${letter}. Aparece ${hits} ${timesText}. Gana ${earned}.`,
        2500
      );

      await enqueue("La computadora ha acertado, sigue jugando 🎛️", 1200);
      rouletteRef.current?.spin(); //  sigue el turno
      return;
    }

    await enqueue(`La computadora elige ${letter}… y falla 😬`, 2500);
    await enqueue("TE TOCA!", 1200);
    goToPlayerTurn();
  };

  // Funcion para que computer elija consonante aleatoria
  const computerChooseRandomConsonant = () => {
    const letter = getRandomEnabledLetter(consonants); // devuelve string o null
    if (!letter) return null;

    setSelectedLetters((prev) => [...prev, letter]);

    setConsonants((prev) =>
      prev.map((item) =>
        item.letter === letter ? { ...item, enabled: false } : item
      )
    );

    return letter;
  };

  // Funcion para que computer elija vocal aleatoria
  const computerChooseRandomVowel = () => {
    const letter = getRandomEnabledLetter(vowels);
    if (!letter) return null;

    setSelectedLetters((prev) => [...prev, letter]);

    setVowels((prev) =>
      prev.map((item) =>
        item.letter === letter ? { ...item, enabled: false } : item
      )
    );

    return letter;
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
   * - desactiva la letra
   * - calcula puntos si corresponde
   * - si falla, pasa turno a computer con delay
   ******************************************************************/
  const handleLetterSelected = (letter, mode) => {
    // Guarda letra seleccionada para pintar en Panel
    setSelectedLetters((prev) => [...prev, letter]);

    /***********************
     * CASO VOCAL (compra)
     ***********************/
    if (mode === "vowel") {
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
      return;
    }

    /*************************
     * CASO CONSONANTE (puntos)
     *************************/
    if (mode === "consonant") {
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
          `La letra ${letter} aparece ${hits} ${timesText}. Ganas ${earned}. Sigue jugando!`
        );

        // Si acierta, sigue jugando
        setRouletteDisabled(false);
        setControlsDisabled(true);
        return;
      }

      const ms = 2500;
      showTemp(
        `La letra ${letter} no está en la frase 😬, pierdes el turno`,
        ms
      );
      goToComputerTurnAfter(ms);
      return;
    }
  };

  /******************************************************************
   * MODAL: cerrar (vuelve a permitir girar)
   ******************************************************************/
  const closeModal = () => {
    setModalMode(null);
    setRouletteDisabled(false);
    setControlsDisabled(true);
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
   * CAMBIO DE TURNO: a computadora (inmediato)
   * (el delay lo controla goToComputerTurnAfter)
   ******************************************************************/
  const goToComputerTurn = () => {
    changeTurn("computer");
    setControlsDisabled(true);
    setRouletteDisabled(true);
  };

  /******************************************************************
   * CAMBIO DE TURNO: a jugador (inmediato)
   * (el delay lo controla goToPlayerTurnAfter)
   ******************************************************************/
  const goToPlayerTurn = () => {
    changeTurn("player");
    setControlsDisabled(true);
    setRouletteDisabled(false);
  };

  /******************************************************************
   * RENDER
   ******************************************************************/
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
          ref={rouletteRef}
          rouletteDisabled={rouletteDisabled}
          spinEnd={spinEnd}
          startSpin={startSpin}
          blockUserSpin={turn === "computer"} // bloquea el botón TIRAR cuando juega la computer
        />

        {modalMode && (
          <ActionModal
            modalMode={modalMode}
            vowels={vowels}
            consonants={consonants}
            handleletterSelected={handleLetterSelected} // ✅ nombre consistente
            closeModal={closeModal}
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
