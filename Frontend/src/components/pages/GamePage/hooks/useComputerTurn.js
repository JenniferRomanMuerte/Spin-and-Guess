import {
  isScoringWedge,
  countLetterInPhrase,
  pluralize,
  getRandomEnabledLetter,
  hasRemainingConsonantInPhrase,
  hasEnoughSolvedVowels,
  isPhraseExhausted,
} from "../utils/gameUtils";

const useComputerTurn = ({
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
      // Si tiene comodín, lo usa automáticamente
      if (jockerComputerCount > 0) {
        setJockerComputerCount((prev) => Math.max(prev - 1, 0));

        await enqueue(
          "💥 ¡QUIEBRA! Pero la computadora usa un comodín y se salva",
          2500,
        );

        await enqueue("La computadora sigue jugando…", 1200);

        requestSpinAgain();
        return;
      }

      // Sin comodín → quiebra normal
      setComputerScore(0);

      await enqueue(
        "💥 ¡QUIEBRA! La computadora pierde todos sus puntos. TE TOCA 👇",
        2500,
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

    // Riesgo
    if (wedge.action === "riesgo") {
      await handleComputerRisk();
      return;
    }

    // Comodín
    if (wedge.action === "comodin") {
      await enqueue("La computadora consigue un comodín 🎟️", 2000);
      setJockerComputerCount((prev) => prev + 1);
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

    // FRASE AGOTADA: no quedan letras útiles =  debe resolver
    if (isPhraseExhausted(consonants, vowels, phrase)) {
      const solved = await computerTrySolve();

      if (solved) {
        onComputerSolve?.(true); // solo modal si gana
        return;
      }

      await enqueue("TE TOCA! 👇", 1200);
      goToPlayerTurn();
      return;
    }

    // No quedan consonantes por salir y hay >= 2 vocales acertadas
    if (
      !hasRemainingConsonantInPhrase(consonants, phrase) &&
      hasEnoughSolvedVowels(selectedLetters, phrase)
    ) {
      const solved = await computerTrySolve();

      if (solved) {
        onComputerSolve?.(true); // solo abrimos modal si gana
        return;
      }

      await enqueue("TE TOCA! 👇", 1200);
      goToPlayerTurn();
      return;
    }

    // Decide si resuelve (Probabilidad)
    if (computerShouldTrySolve()) {
      const solved = await computerTrySolve();

      if (solved) {
        onComputerSolve?.(true); // solo abrimos modal si gana
        return;
      }

      await enqueue("TE TOCA! 👇", 1200);
      goToPlayerTurn();
      return;
    }

    // Decide vocal vs consonante
    const shouldBuyVowel = computeShouldBuyVowel();

    if (shouldBuyVowel) {
      await playComputerVowel();
      return;
    }

    await playComputerConsonant(wedge);
  };

  /******************************************************************
   * Regla: decide si resuelve
   ******************************************************************/
  const computerShouldTrySolve = () => {
    const revealedLettersRatio =
      selectedLetters.length / phrase.replace(/\s/g, "").length;

    // Cuantas más letras conocidas, más probable resolver
    if (revealedLettersRatio > 0.6) return true;

    // Si va muy sobrada de puntos, arriesga
    if (computerScore >= 1000) return Math.random() < 0.5;

    return false;
  };

  /******************************************************************
   * COMPUTER: intenta resolver
   ******************************************************************/
  const computerTrySolve = async () => {
    await enqueue("La computadora va a intentar resolver la frase… 🤖", 2000);

    const solved = Math.random() < 0.5;

    await enqueue(
      solved
        ? "😱 ¡La computadora ha acertado!"
        : "😬 La computadora ha fallado al resolver",
      2000,
    );

    return solved;
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
      1500,
    );

    const letter = computerChooseRandomVowel();

    if (!letter) {
      await enqueue("Ups, no quedan vocales disponibles 😵", 2000);
      goToPlayerTurn();
      return;
    }

    // Paga
    setComputerScore((prev) => prev - VOWEL_COST);

    const hits = countLetterInPhrase(phrase, letter);
    const timesText = pluralize(hits, "vez", "veces");

    if (hits > 0) {
      await enqueue(
        `La computadora compra ${letter}. Aparece ${hits} ${timesText}.`,
        2500,
      );
      await enqueue("✅ Acierta y sigue jugando 🎛️", 1200);
      requestSpinAgain();
      return;
    }

    await enqueue(`La computadora compra ${letter}… pero no está 😬`, 2500);
    await enqueue("TE TOCA 👇", 1200);
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
        2000,
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
        2500,
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

    setSelectedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter],
    );

    setConsonants((prev) =>
      prev.map((item) =>
        item.letter === letter ? { ...item, enabled: false } : item,
      ),
    );

    return letter;
  };

  /******************************************************************
   * COMPUTER: Elige vocal aletatoria
   ******************************************************************/
  const computerChooseRandomVowel = () => {
    const letter = getRandomEnabledLetter(vowels);
    if (!letter) return null;

    setSelectedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter],
    );

    setVowels((prev) =>
      prev.map((item) =>
        item.letter === letter ? { ...item, enabled: false } : item,
      ),
    );

    return letter;
  };

  /******************************************************************
   * COMPUTER: gajo de riesgo
   ******************************************************************/
  const handleComputerRisk = async () => {
    await enqueue("La computadora cae en un gajo misterioso… ❓", 2000);

    // Decide si arriesga (regla simple y ajustable)
    const shouldRisk = Math.random() < 0.6;

    if (!shouldRisk) {
      await enqueue("🤖 La computadora decide no arriesgar.", 1500);
      requestSpinAgain();
      return;
    }

    const lucky = Math.random() < 0.5;

    if (lucky) {
      setComputerScore((prev) => prev * 2);
      await enqueue("🍀 ¡Suerte! La computadora duplica sus puntos.", 2000);
    } else {
      setComputerScore((prev) => Math.floor(prev / 2));
      await enqueue("💥 Mala suerte… la computadora pierde la mitad.", 2000);
    }

    // Tras el riesgo, sigue jugando
    requestSpinAgain();
  };

  return {
    handleComputerSpinEnd,
  };
};

export default useComputerTurn;
