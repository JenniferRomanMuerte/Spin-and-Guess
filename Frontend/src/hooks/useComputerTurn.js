import {
  isScoringWedge,
  countLetterInPhrase,
  pluralize,
  getRandomEnabledLetter,
} from "../utils/gameUtils";

const useComputerTurn = ({
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
}) => {
  /******************************************************************
   * LÓGICA TURNO COMPUTER (dispatcher)
   ******************************************************************/
  const handleComputerSpinEnd = async (wedge) => {
    if (!isScoringWedge(wedge)) {
      await handleComputerNonScoringWedge(wedge);
      return;
    }

    await handleComputerScoringWedge(wedge);
  };

  /******************************************************************
   * COMPUTER: gajo NO puntuable (quiebra / pierde turno / comodín / etc.)
   ******************************************************************/
  const handleComputerNonScoringWedge = async (wedge) => {
    // Quiebra
    if (wedge.action === "quiebra") {
      setComputerScore(0);
      await enqueue(
        "¡QUIEBRA! La computadora pierde todos sus puntos 💸, TE TOCA!",
        2000
      );
      goToPlayerTurn();
      return;
    }

    // Pierde turno
    if (wedge.action === "pierdeTurno") {
      await enqueue("La computadora pierde el turno. TE TOCA!", 2000);
      goToPlayerTurn();
      return;
    }

    // Comodín (por decidir regla)
    if (wedge.action === "comodin") {
      await enqueue("La computadora consigue un comodín 🎟️", 2000);
      await enqueue("La computadora vuelve a tirar…", 1000);
      requestSpinAgain();
      return;
    }

    // Otros casos
    goToPlayerTurn();
  };

  /******************************************************************
   * COMPUTER: gajo de PUNTOS (juega letras)
   ******************************************************************/
  const handleComputerScoringWedge = async (wedge) => {
    // 1) Informamos valor del gajo
    await enqueue(`La computadora juega por: ${wedge.value}`, 2000);

    // 2) Decide vocal vs consonante
    const shouldBuyVowel = computeShouldBuyVowel();

    if (shouldBuyVowel) {
      await playComputerVowel();
      return;
    }

    await playComputerConsonant(wedge);
  };

  /******************************************************************
   * Regla: decide si la computer compra vocal
   ******************************************************************/
  const computeShouldBuyVowel = () => {
    const enabledVowelsCount = vowels.filter((v) => v.enabled).length;
    const enabledConsonantsCount = consonants.filter((c) => c.enabled).length;
    //Si no puede pagar o no quedan vocales, no compra
    if (computerScore < VOWEL_COST || enabledVowelsCount === 0) return false;

    // Si quedan pocas consonantes, sí o sí conviene vocal
    if (enabledConsonantsCount <= 5) return true;

    // Probabilidad base
    let p = 0.25;

    // Si va sobrada de dinero, subimos probabilidad
    if (computerScore >= 300) p = 0.4;
    return Math.random() < p;
  };

  /******************************************************************
   * COMPUTER: jugar comprando vocal (no depende del wedge.value)
   ******************************************************************/
  const playComputerVowel = async () => {
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
      requestSpinAgain();
      return;
    }

    await enqueue(`La computadora compra ${letter}… pero no está 😬`, 2500);
    await enqueue("Te toca a ti 👇", 1200);
    goToPlayerTurn();
  };

  /******************************************************************
   * COMPUTER: jugar consonante (sí depende de wedge.value)
   ******************************************************************/
  const playComputerConsonant = async (wedge) => {
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
    const timesText = pluralize(hits, "vez", "veces");

    if (hits > 0) {
      const earned = hits * wedge.value;
      setComputerScore((prev) => prev + earned);

      await enqueue(
        `La computadora elige ${letter}. Aparece ${hits} ${timesText}. Gana ${earned}.`,
        2500
      );
      await enqueue("La computadora ha acertado, sigue jugando 🎛️", 1200);
      requestSpinAgain();
      return;
    }

    await enqueue(`La computadora elige ${letter}… y falla 😬`, 2500);
    await enqueue("TE TOCA!", 1200);
    goToPlayerTurn();
  };

  /******************************************************************
   * COMPUTER: Elige consonante aletatoria
   ******************************************************************/
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

  /******************************************************************
   * COMPUTER: Elige vocal aletatoria
   ******************************************************************/
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

  return {
    handleComputerSpinEnd,
  };
};

export default useComputerTurn;
