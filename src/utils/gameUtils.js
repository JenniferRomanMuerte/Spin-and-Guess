
// Cuenta cuántas veces aparece una letra en una frase (ignorando mayúsculas/minúsculas)
export const countLetterInPhrase = (phrase, letter) => {
  const target = letter.toUpperCase();
  return phrase
    .toUpperCase()
    .split("")
    .filter((ch) => ch === target).length;
};

// Devuelve una letra  ALEATORIA de las que siguen enabled
// O null si no queda ninguna disponible
export const getRandomEnabledLetter = (letters) => {
  const enabled = letters.filter((item) => item.enabled);
  if (enabled.length === 0) return null;

  const pick = enabled[Math.floor(Math.random() * enabled.length)];
  return pick.letter;
};

// Para saber si el gajo suma puntos
export const isScoringWedge = (wedge) =>
  wedge?.action === "sumar" || wedge?.action === "superPremio";
