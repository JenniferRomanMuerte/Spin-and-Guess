// Comprobar si queda alguna consonante sin salir en la frase
export const hasRemainingConsonantInPhrase = (consonants, phrase) => {
  return consonants.some(
    (c) => c.enabled && phrase.toLowerCase().includes(c.letter.toLowerCase())
  );
};

// Comprobar si queda alguna vocal sin salir en la frase
export const hasUsefulVowelsLeft = (vowels, phrase) => {
  return vowels.some(
    (v) => v.enabled && phrase.toLowerCase().includes(v.letter.toLowerCase())
  );
};

// Comprobar si hay 1 vocal acertada
export const hasEnoughSolvedVowels = (selectedLetters, phrase) => {
  const vowelsSet = ["a", "e", "i", "o", "u"];

  const solvedVowels = selectedLetters.filter(
    (letter) =>
      vowelsSet.includes(letter.toLowerCase()) &&
      phrase.toLowerCase().includes(letter.toLowerCase())
  );

  return solvedVowels.length >= 1;
};

// No quedan consonantes ni vocales por salir
export const isPhraseExhausted = (consonants, vowels, phrase) => {
  return (
    !hasRemainingConsonantInPhrase(consonants, phrase) &&
    !hasUsefulVowelsLeft(vowels, phrase)
  );
};