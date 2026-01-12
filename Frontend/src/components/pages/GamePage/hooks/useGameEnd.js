import { useEffect, useRef } from "react";

const useGameEnd = ({
  solveResult,
  solveBy,

  phrase,
  phraseId,
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
}) => {
  const hasSavedGameRef = useRef(false);

  useEffect(() => {
    if (solveResult === null) return;

    if (hasSavedGameRef.current) return;

    cancelTurnTimeout();

    if (solveResult === true && solveBy === "player") {
      hasSavedGameRef.current = true;

      // Revelamos toda la frase
      revealFullPhrase();

      // Congelamos el tablero
      setRoundEnded(true);

      // Mostramos mensaje con la frase
      show(`🎉 ¡Correcto! La frase era: "${phrase}"`);

      console.log("GUARDANDO PARTIDA CON phraseId =", phraseId);

      //Guardamos la puntuación de la partida
      saveGame({ score: playerScore, phraseId, result: "win" }).catch((err) =>
        console.error("Error guardando partida", err)
      );

      return;
    }

    if (solveResult === true && solveBy === "computer") {
      hasSavedGameRef.current = true;

      revealFullPhrase();
      setRoundEnded(true);
      show(`🤖 La computadora ha resuelto la frase: ${phrase}`);
      console.log("GUARDANDO PARTIDA CON phraseId =", phraseId);

      saveGame({
        score: 0,
        phraseId,
        result: "lose",
      }).catch((err) => console.error("Error guardando partida", err));
      return;
    }

    if (solveResult === false) {
      turnTimeoutRef.current = setTimeout(() => {
        closeModal();
        setSolveResult(null);
        setSolveBy(null);
        goToComputerTurn();
      }, 2000);
    }
  }, [solveResult, solveBy]);

  useEffect(() => {
    if (solveResult === null) {
      hasSavedGameRef.current = false;
    }
  }, [solveResult]);
};

export default useGameEnd;
