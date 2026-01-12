import { normalizePhrase } from "../utils/gameUtils";

const useGameFlow = ({
  turn,
  phrase,
  currentWedge,

  handlePlayerSpinEnd,
  handleComputerSpinEnd,
  handleLetterSelected,
  handlePlayerResult,

  lockUI,
  setCurrentWedge,
  setSolveBy,
  setSolveResult,
}) => {
  /******************************************************************
   * CALLBACK: el jugador elige una letra desde el modal
   ******************************************************************/
  const onLetterSelected = (letter, mode) => {
    lockUI();
    const result = handleLetterSelected(letter, mode);

    handlePlayerResult(result, currentWedge);

  };

  /******************************************************************
   * CALLBACK: la ruleta termina de girar
   * Punto central del flujo del juego:
   * - decide si actúa la IA o el jugador
   ******************************************************************/
  const spinEnd = (wedge) => {
    lockUI();
    setCurrentWedge(wedge);

    if (turn === "computer") {
      handleComputerSpinEnd(wedge);
      return;
    }

    const result = handlePlayerSpinEnd(wedge);
    handlePlayerResult(result, wedge);
  };

  /******************************************************************
   * CALLBACK: el jugador intenta resolver la frase completa
   * Compara la frase introducida con la frase real
   ******************************************************************/
  const onSubmitSolve = (phrasePlayer) => {
    lockUI();
    setSolveBy("player");
    setSolveResult(null);

    // Normalizamos ambas frases para evitar falsos negativos
    const normalizedPlayer = normalizePhrase(phrasePlayer);
    const normalizedPhrase = normalizePhrase(phrase);

    // Comparamos
     setSolveResult(normalizedPlayer === normalizedPhrase);
  };

  return {
    spinEnd,
    onLetterSelected,
    onSubmitSolve,
  };
};

export default useGameFlow;
