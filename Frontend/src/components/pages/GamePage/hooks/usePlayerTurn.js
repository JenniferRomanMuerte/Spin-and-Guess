import {
  isScoringWedge,
  countLetterInPhrase,
} from "../utils/gameUtils";

const userPlayerTurn = ({
  phrase,
  playerScore,
  currentWedge,
  setPlayerScore,
  setVowels,
  setConsonants,
  setSelectedLetters,
  VOWEL_COST,
}) => {
  /******************************************************************
   * TURNO JUGADOR: resolución del gajo al terminar el giro
   * Devuelve un "resultado" que GamePage interpretará
   ******************************************************************/
  const handlePlayerSpinEnd = (wedge) => {
    // Gajo de puntos → puede elegir acción
    if (isScoringWedge(wedge)) {
      return {
        type: "SCORING_WEDGE",
        wedge,
      };
    }

    // Comodín
    if (wedge.action === "comodin") {
      return {
        type: "JOKER",
      };
    }

    // Pierde turno
    if (wedge.action === "pierdeTurno") {
      return {
        type: "LOSE_TURN",
      };
    }

    // Quiebra
    if (wedge.action === "quiebra") {

      return {
        type: "BANKRUPT",
      };
    }

    // Riesgo
    if (wedge.action === "riesgo") {
      return {
        type: "RISK_WEDGE",
      };
    }

    return { type: "NONE" };
  };

  /******************************************************************
   * JUGADOR ELIGE LETRA
   * Dispatcher según tipo de acción
   ******************************************************************/
  const handleLetterSelected = (letter, mode) => {
    setSelectedLetters((prev) => [...prev, letter]);

    if (mode === "vowel") return handlePlayerVowel(letter);
    if (mode === "consonaFnt") return handlePlayerConsonant(letter);

    return { type: "NONE" };
  };

  /******************************************************************
   * JUGADOR COMPRA VOCAL
   ******************************************************************/
  const handlePlayerVowel = (letter) => {
    // Desactiva vocal
    setVowels((prev) =>
      prev.map((item) =>
        item.letter === letter ? { ...item, enabled: false } : item
      )
    );

    // No tiene dinero suficiente
    if (playerScore < VOWEL_COST) {
      return { type: "NOT_ENOUGH_MONEY" };
    }

    // Paga la vocal
    setPlayerScore((prev) => prev - VOWEL_COST);

    const hits = countLetterInPhrase(phrase, letter);

    // Acierta vocal
    if (hits > 0) {
      return {
        type: "VOWEL_HIT",
        letter,
        hits,
      };
    }

    // Falla vocal → pierde turno
    return {
      type: "VOWEL_MISS",
      letter,
    };
  };

  /******************************************************************
   * JUGADOR ELIGE CONSONANTE
   ******************************************************************/
  const handlePlayerConsonant = (letter) => {
    // Desactiva consonante
    setConsonants((prev) =>
      prev.map((item) =>
        item.letter === letter ? { ...item, enabled: false } : item
      )
    );

    // Seguridad: solo con gajo puntuable
    if (!isScoringWedge(currentWedge)) {
      return { type: "INVALID_ACTION" };
    }

    const hits = countLetterInPhrase(phrase, letter);

    // Acierta consonante
    if (hits > 0) {
      const earned = hits * currentWedge.value;
      setPlayerScore((prev) => prev + earned);

      return {
        type: "CONSONANT_HIT",
        letter,
        hits,
        earned,
      };
    }

    // Falla consonante → pierde turno
    return {
      type: "CONSONANT_MISS",
      letter,
    };
  };

  /******************************************************************
   * API pública del hook
   ******************************************************************/
  return {
    handlePlayerSpinEnd,
    handleLetterSelected,
  };
};

export default userPlayerTurn;
